/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DEVELOPMENT_DATABASE_USERNAME,
    password: process.env.DEVELOPMENT_DATABASE_PASSWORD,
    database: process.env.DEVELOPMENT_DATABASE_NAME,
    host: process.env.DEVELOPMENT_DATABASE_HOST,
    port: process.env.DEVELOPMENT_DATABASE_PORT,
    dialect: "postgres",
    logging: true,
  },
  test: {
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE_NAME,
    host: process.env.TEST_DATABASE_HOST,
    port: process.env.TEST_DATABASE_PORT,
    dialect: "postgres",
    logging: true,
  },
  production: {
    username: process.env.PRODUCTION_DATABASE_USERNAME,
    password: process.env.PRODUCTION_DATABASE_PASSWORD,
    database: process.env.PRODUCTION_DATABASE_NAME,
    host: process.env.PRODUCTION_DATABASE_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "postgres",
    logging: false,
  },
};
