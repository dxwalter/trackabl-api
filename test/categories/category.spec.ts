/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomEmail = require("random-email");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addEndpoint, renderDocumentation } = require("../setup/documentation");
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppModule } from "../../src/Components/app/app.module";
import { UserModule } from "../../src/Components/user/user.module";
import { WaitlistModule } from "../../src/Components/waitlist/waitlist.module";
import { PlatformFeatureStatusModule } from "../../src/Components/platform-feature-status/platform-status.module";
import * as dotenv from "dotenv";
import * as path from "path";
import { models } from "../../src/models";
import { Utils } from "../../src/Components/utils/index";
import { AdminStatusMessages } from "../../src/Components/admin/config/admin-response-message";
import { ADMIN_TYPE } from "../../src/Components/admin/types/admin.constants";

dotenv.config();

describe("Category & Subcategories (e2e)", () => {
  let app: INestApplication;
  const userEmail: string = randomEmail();
  let referralCode: string | undefined = undefined;
  const referredUser: string = randomEmail();
  let waitlistId: number | undefined = undefined;
  const utils = new Utils();
  const randomPassword = utils.generateRandomString(7);
  const newUpdatedPassword = utils.generateRandomString(7);

  let userToken = undefined;
  let userTokenTwo = undefined;
  let emailVerificationCode = undefined;
  let passwordResetCode = undefined;
  let userId = 0;
  let featureId = undefined;

  const referredUserEmail: string = randomEmail();
  const referredUserPassword = utils.generateRandomString(7);

  beforeAll(async () => {
    const dbPort = process.env.TEST_DATABASE_PORT;

    const moduleFixture = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: "postgres",
          host: process.env.TEST_DATABASE_HOST,
          port: Number(dbPort),
          username: process.env.TEST_DATABASE_USERNAME,
          password: process.env.TEST_DATABASE_PASSWORD,
          database: process.env.TEST_DATABASE_NAME,
          ...models,
          autoLoadModels: true,
          synchronize: false,
          logging: false,
        }),
        AppModule,
        WaitlistModule,
        UserModule,
        PlatformFeatureStatusModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    renderDocumentation();
  });

  it("Seed Login an admin [SUCCESS]", () => {
    return request(app.getHttpServer())
      .post("/admin/login")
      .send({
        email: "ccc@gmail.com",
        password: "cccddedded",
        trial_count: 0,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("token" in res.body.data)) {
          throw new Error("Response should contain latest subscription.");
        }

        if (res.body.message !== AdminStatusMessages.Login.success) {
          throw new Error("Invalid message response.");
        }

        userToken = res.body.data.token;
        userId = res.body.data.id;

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Create an admin", () => {
    return request(app.getHttpServer())
      .post("/admin/create")
      .send({
        email: userEmail,
        password: randomPassword,
        fullname: "Daniel",
        accessLevel: ADMIN_TYPE.ADMIN,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== AdminStatusMessages.CreateAccount.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Login an admin [Failed]", () => {
    return request(app.getHttpServer())
      .post("/admin/login")
      .send({
        email: "w" + userEmail,
        password: randomPassword,
        trial_count: 0,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== AdminStatusMessages.Login.error) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });
});
