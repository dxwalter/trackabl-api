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

describe("UserController (e2e)", () => {
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

  it("Join Wellat as a user", () => {
    return request(app.getHttpServer())
      .post("/auth/create")
      .send({
        email: userEmail,
        password: randomPassword,
        firstName: "Daniel",
        lastName: "Walter",
        trial_count: 0,
        tcAndPpAcceptedDate: new Date(),
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
        userId = res.body.data.id;
        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Get user profile", () => {
    return request(app.getHttpServer())
      .get("/user")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== UserStatusMessages.UserActions.ok) {
          throw new Error("Invalid message response.");
        }

        if (res.body.data.id !== userId) {
          throw new Error("Invalid id retrieved.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Update user profile", () => {
    return request(app.getHttpServer())
      .patch("/user/update-profile")
      .send({
        firstName: "NewFirstName",
        lastName: "NewLastName",
        email: randomEmail(),
        nationality: "Nigeria",
        phoneNumber: "+2348104683729",
      })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== UserStatusMessages.UserActions.updateProfile) {
          throw new Error("Invalid message response.");
        }

        if (res.body.data.firstName !== "NewFirstName") {
          throw new Error("Invalid data retrieved.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Update user password", () => {
    return request(app.getHttpServer())
      .patch("/user/security/change-password")
      .send({
        oldPassword: randomPassword,
        newPassword: "123456778",
        trial_count: 0,
      })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !== UserStatusMessages.UserActions.passwordUpdate
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Create user transaction pin", () => {
    return request(app.getHttpServer())
      .post("/user/security/transaction-pin")
      .send({
        pin: 1234,
        trial_count: 0,
      })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !==
          UserStatusMessages.UserActions.transactionPinCreated
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Update user transaction pin", () => {
    return request(app.getHttpServer())
      .patch("/user/security/transaction-pin")
      .send({
        oldPin: 1234,
        newPin: 1234,
        trial_count: 0,
      })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !==
          UserStatusMessages.UserActions.transactionPinUpdated
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Get user profile", () => {
    return request(app.getHttpServer())
      .get("/user")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== UserStatusMessages.UserActions.ok) {
          throw new Error("Invalid message response.");
        }

        if (res.body.data.id !== userId) {
          throw new Error("Invalid id retrieved.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Delete a user account [SUCCESS]", () => {
    return request(app.getHttpServer())
      .delete("/user")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== UserStatusMessages.UserActions.deleteAccount) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });
});
