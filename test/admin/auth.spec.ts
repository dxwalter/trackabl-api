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
import * as dotenv from "dotenv";
import * as path from "path";
import { models } from "../../src/models";
import { Utils } from "../../src/Components/utils/index";
import { UserStatusMessages } from "../../src/Components/user/config/user-response-message";

dotenv.config();

describe("AuthController (e2e)", () => {
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    renderDocumentation();
  });

  it("Join Trackabl as a user", () => {
    return request(app.getHttpServer())
      .post("/auth/create")
      .send({
        email: userEmail,
        password: randomPassword,
        fullname: "Daniel Walter",
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

        if (res.body.message !== UserStatusMessages.CreateAccount.success) {
          throw new Error("Invalid message response.");
        }

        userToken = res.body.data.token;
        emailVerificationCode = res.body.data.emailVerificationCode;
        referralCode = res.body.data.referralCode;

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Verify user email", () => {
    return request(app.getHttpServer())
      .patch("/auth/verify-email/" + emailVerificationCode)
      .send({ trial_count: 0 })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== UserStatusMessages.EmailVerification.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Login a user [SUCCESS]", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: userEmail,
        password: randomPassword,
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

        if (res.body.message !== UserStatusMessages.Login.success) {
          throw new Error("Invalid message response.");
        }

        userToken = res.body.data.token;
        userId = res.body.data.id;

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });
});
