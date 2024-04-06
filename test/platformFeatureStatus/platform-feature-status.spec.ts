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
import { UserStatusMessages } from "../../src/Components/user/config/user-response-message";
import { PlatformFeaturetatusMessages } from "../../src/Components/platform-feature-status/config/platform-status-response-message";

dotenv.config();

describe("PlatformFeatureStatus (e2e)", () => {
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

        addEndpoint(res, {
          tags: ["User"],
        });
      });
  });

  it("Create plaform feature", () => {
    return request(app.getHttpServer())
      .post("/platform-feature/create")
      .send({
        feature: "SIGNUPTEST",
        status: true,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== PlatformFeaturetatusMessages.create.success) {
          throw new Error("Invalid message response.");
        }

        featureId = res.body.data.id;

        addEndpoint(res, {
          tags: ["PlatformFeatureStatus"],
        });
      });
  });

  it("Update status", () => {
    return request(app.getHttpServer())
      .patch("/platform-feature/update/" + featureId)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== PlatformFeaturetatusMessages.update.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["PlatformFeatureStatus"],
        });
      });
  });

  // it("Join Wellat as a user but fail due to feature status", () => {
  //   return request(app.getHttpServer())
  //     .post("/auth/create")
  //     .send({
  //       email: referredUserEmail,
  //       password: randomPassword,
  //       firstName: "Daniel",
  //       lastName: "Walter",
  //       trial_count: 0,
  //       tcAndPpAcceptedDate: new Date(),
  //     })
  //     .set("Accept", "application/json")
  //     .expect(function (res) {
  //       if (
  //         res.body.message !==
  //         PlatformFeaturetatusMessages.featureStatus.unavailable
  //       ) {
  //         throw new Error("Invalid message response.");
  //       }

  //       addEndpoint(res, {
  //         tags: ["User"],
  //       });
  //     });
  // });

  it("delete feature", () => {
    return request(app.getHttpServer())
      .delete("/platform-feature/delete/" + featureId)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== PlatformFeaturetatusMessages.delete.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["PlatformFeatureStatus"],
        });
      });
  });
});
