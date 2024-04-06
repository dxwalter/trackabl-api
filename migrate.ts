import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Umzug, SequelizeStorage } = require("umzug");

console.log(Umzug);

dotenv.config();

const env = {
  ts: "test",
  dv: "development",
  pr: "production",
};

const getDBport =
  process.env.NODE_ENV === env.ts
    ? process.env.TEST_DATABASE_PORT
    : process.env.NODE_ENV === env.dv
    ? process.env.DEVELOPMENT_DATABASE_PORT
    : process.env.PRODUCTION_DATABASE_PORT;

const host =
  process.env.NODE_ENV === env.ts
    ? process.env.TEST_DATABASE_HOST
    : process.env.NODE_ENV === env.dv
    ? process.env.DEVELOPMENT_DATABASE_HOST
    : process.env.PRODUCTION_DATABASE_HOST;

const port = getDBport === undefined ? 0 : parseInt(getDBport);

const username =
  process.env.NODE_ENV === env.ts
    ? process.env.TEST_DATABASE_USERNAME
    : process.env.NODE_ENV === env.dv
    ? process.env.DEVELOPMENT_DATABASE_USERNAME
    : process.env.PRODUCTION_DATABASE_USERNAME;

const password =
  process.env.NODE_ENV === env.ts
    ? process.env.TEST_DATABASE_PASSWORD
    : process.env.NODE_ENV === env.dv
    ? process.env.DEVELOPMENT_DATABASE_PASSWORD
    : process.env.PRODUCTION_DATABASE_PASSWORD;

const database =
  process.env.NODE_ENV === env.ts
    ? process.env.TEST_DATABASE_NAME
    : process.env.NODE_ENV === env.dv
    ? process.env.DEVELOPMENT_DATABASE_NAME
    : process.env.PRODUCTION_DATABASE_NAME;

const sequelize = new Sequelize({
  dialect: "postgres",
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
});

const umzug = new Umzug({
  storage: "sequelize",
  storageOptions: { sequelize },
  logging: false,
  migrations: {
    params: [sequelize.getQueryInterface(), Sequelize],
    path: "./src/Database/migrations",
    pattern: /\.ts$/,
  },
});

const task = (process.argv[2] || "").trim();

switch (task) {
  case "up":
    umzug.up({ migrations: ["m5", "m3"] }).then((result) => {
      console.log("Migrations up went successful!", result);
      process.exit(0);
    });
    break;
  case "down":
    umzug.down().then((result) => {
      console.log("Migrations down went successful!", result);
      process.exit(0);
    });
    break;
  default:
    break;
}
