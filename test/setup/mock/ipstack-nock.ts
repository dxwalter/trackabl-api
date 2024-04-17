// eslint-disable-next-line @typescript-eslint/no-var-requires
const nock = require("nock");

import {
  IpStackFailedRequest,
  IpStackSuccessfulRequest,
} from "./ipstack-nock-data";

const baseUrl = "http://api.ipstack.com";
