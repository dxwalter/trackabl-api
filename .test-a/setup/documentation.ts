/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const masterTemplate = {
  openapi: "3.0.0",
  info: {
    title: "FH Turbo API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://api.something.com",
    },
    {
      url: "http://localhost:7701",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {},
};

const getSchema = (variable) => {
  if (variable == null) {
    return {};
  }
  let schema;
  switch (typeof variable) {
    case "string":
      return { type: "string" };
    case "number":
      return { type: "number" };
    case "object":
      if (Array.isArray(variable)) {
        return {
          type: "array",
          items: getSchema(variable[0]),
        };
      }
      schema = {
        type: "object",
        properties: {},
      };
      for (const [key, value] of Object.entries(variable)) {
        schema.properties[key] = getSchema(value);
      }
      return schema;
  }
};

const getHeaderParameters = (headers) => {
  return Object.keys(headers)
    .filter(
      (key) => !["User-Agent", "Content-Type", "Authorization"].includes(key)
    )
    .map((header) => ({
      in: "header",
      name: header,
      schema: getSchema(headers[header]),
    }));
};

const getQueryParameters = (path) => {
  const URLSearchParams = require("url").URLSearchParams;
  const queryParams = new URLSearchParams(path.split("?")[1]);
  return Array.from(queryParams.entries()).map(([key, value]) => ({
    in: "query",
    name: key,
    schema: getSchema(value),
  }));
};

const getPathParameters = (options) => {
  const params = options.pathParameters || [];
  return params.map((param) => ({
    in: "path",
    name: param.name,
    description: param.description || "",
    schema: getSchema("string"),
    required: true,
  }));
};

const getPath = (req, res, options) => {
  return {
    [req.method]: {
      description: options.description || "",
      tags: options.tags || [],
      parameters: [
        ...getHeaderParameters(req.headers),
        ...getPathParameters(options),
        ...getQueryParameters(req.path),
      ],
      ...(req.body
        ? {
            requestBody: {
              content: {
                "application/json": {
                  schema: getSchema(req.body),
                  example: req.body,
                },
              },
            },
          }
        : {}),
      responses: {
        200: {
          description: "",
          content: {
            "application/json": {
              schema: getSchema(res.body),
              example: res.body,
            },
          },
        },
      },
    },
  };
};

const endpoints: any = [];

module.exports.addEndpoint = (res, options = {}) => {
  const request = {
    method: res.request.method.toLowerCase(),
    path: res.res.req.path,
    headers: res.request.header,
    body: res.request._data || null,
  };
  const response = {
    body: res.body,
  };
  endpoints.push({
    request,
    response,
    options,
  });
};

const transformPath = (path, options) => {
  if (options.pathParameters) {
    const pathArray = path
      .split("/")
      .slice(1)
      .map((segment, index) => {
        const param = options.pathParameters.find((p) => p.index === index);
        if (param) {
          return `{${param.name}}`;
        }
        return segment;
      });
    return "/" + pathArray.join("/");
  }
  return path.split("?").shift();
};

module.exports.renderDocumentation = (name = "api") => {
  const template = Object.assign({}, masterTemplate);
  for (const endpoint of endpoints) {
    const { request, response, options } = endpoint;
    const path = transformPath(request.path, options);
    template.paths[path] = {
      ...(template.paths[path] || {}),
      ...getPath(request, response, options),
    };
  }
  require("fs").writeFileSync(
    `docs/${name}.json`,
    JSON.stringify(template, undefined, 2),
    "utf8"
  );
  return template;
};
