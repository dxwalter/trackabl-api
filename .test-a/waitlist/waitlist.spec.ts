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
import { WaitlistModule } from "../../src/Components/waitlist/waitlist.module";
import * as dotenv from "dotenv";
import * as path from "path";
import { models } from "../../src/models";
import { WaitlistStatusMessages } from "../../src/Components/waitlist/config/waitlist-status-message";

dotenv.config();

describe("WaitlistController (e2e)", () => {
  let app: INestApplication;
  const userEmail: string = randomEmail();
  let referralCode: string | undefined = undefined;
  const referredUser: string = randomEmail();
  let waitlistId: number | undefined = undefined;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    renderDocumentation();
  });

  it("Join waitlist", () => {
    return request(app.getHttpServer())
      .post("/waitlist/join")
      .send({
        email: userEmail,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("referralCode" in res.body.data)) {
          throw new Error("Response should contain latest subscription.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.success) {
          throw new Error("Invalid message response.");
        }

        waitlistId = res.body.data.id;
        referralCode = res.body.data.referralCode;

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Cancel request after 4 trials", () => {
    return request(app.getHttpServer())
      .post("/waitlist/join")
      .send({
        email: userEmail,
        trial_count: 4,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !== WaitlistStatusMessages.JoinWaitlist.maximumTrial
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Join waitlist via referral 1", () => {
    return request(app.getHttpServer())
      .post("/waitlist/join")
      .send({
        email: referredUser,
        referral_code: referralCode,
        trial_count: 1,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("referralCode" in res.body.data)) {
          throw new Error("Response should contain latest subscription.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Join waitlist via referral 2", () => {
    return request(app.getHttpServer())
      .post("/waitlist/join")
      .send({
        email: randomEmail(),
        referral_code: referralCode,
        trial_count: 1,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("referralCode" in res.body.data)) {
          throw new Error("Response should contain latest subscription.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Join waitlist via referral 3", () => {
    return request(app.getHttpServer())
      .post("/waitlist/join")
      .send({
        email: randomEmail(),
        referral_code: referralCode,
        trial_count: 1,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("referralCode" in res.body.data)) {
          throw new Error("Response should contain latest subscription.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Join waitlist via referral 4", () => {
    return request(app.getHttpServer())
      .post("/waitlist/join")
      .send({
        email: randomEmail(),
        referral_code: referralCode,
        trial_count: 1,
      })
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("referralCode" in res.body.data)) {
          throw new Error("Response should contain latest subscription.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Get users point list", () => {
    return request(app.getHttpServer())
      .get("/waitlist/" + userEmail)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.data.user_waitlist_points === 5) {
          throw new Error("This user list of points is inaccurate.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.ok) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Remove from waitlist", () => {
    return request(app.getHttpServer())
      .delete("/waitlist/" + userEmail)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.delete) {
          throw new Error("Invalid message response.");
        }

        // adminAccessToken = res.body.data.token;

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });

  it("Remove from waitlist referred user", () => {
    return request(app.getHttpServer())
      .delete("/waitlist/" + referredUser)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== WaitlistStatusMessages.JoinWaitlist.delete) {
          throw new Error("Invalid message response.");
        }

        // adminAccessToken = res.body.data.token;

        addEndpoint(res, {
          tags: ["WaitList"],
        });
      });
  });
});
