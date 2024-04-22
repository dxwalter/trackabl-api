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
import { SubcriptionPlanStatusMessage } from "../../src/Components/subscription/config/subscription-response-message";
import { nockIpStackRequest } from "../setup/mock/ipstack-nock";
import { AdminStatusMessages } from "../../src/Components/admin/config/admin-response-message";
import { ADMIN_TYPE } from "../../src/Components/admin/types/admin.constants";
import {
  Plan,
  Market,
} from "../../src/Components/subscription/types/price.types";

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
  let adminToken = undefined;
  let userTokenTwo = undefined;
  let emailVerificationCode = undefined;
  let passwordResetCode = undefined;
  let adminId = 0;
  let userId = 0;

  // admin
  let markets: Market[] = [];
  let plans: Plan[] = [];

  let planId = undefined;
  const priceIds = {
    priceId1: 0,
    priceId2: 0,
  };

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

        adminToken = res.body.data.token;
        adminId = res.body.data.id;

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Create subscription plan", () => {
    return request(app.getHttpServer())
      .post("/subscription/create-plan")
      .send({
        name: "Auth-Platinum",
        status: true,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        console.log(res.body);
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.plan.created) {
          throw new Error("Invalid message response.");
        }

        planId = res.body.data.id;
        addEndpoint(res, {
          tags: ["Subscription"],
        });
      });
  });

  it("Create subscription plan", () => {
    return request(app.getHttpServer())
      .post("/subscription/create-plan")
      .send({
        name: "Auth-Platinum-us",
        status: true,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.plan.created) {
          throw new Error("Invalid message response.");
        }

        planId = res.body.data.id;
        addEndpoint(res, {
          tags: ["Subscription"],
        });
      });
  });

  it("Get Markets", () => {
    return request(app.getHttpServer())
      .get("/subscription/markets")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data.length < 2) {
          throw new Error("Response should contain 2 markets.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.default) {
          throw new Error("Invalid message response.");
        }

        markets = res.body.data;
        addEndpoint(res, {
          tags: ["Subscription"],
        });
      });
  });

  it("Get Plans", () => {
    return request(app.getHttpServer())
      .get("/subscription/admin-plans")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data.length < 2) {
          throw new Error("Response should contain 2 markets.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.default) {
          throw new Error("Invalid message response.");
        }

        plans = res.body.data;

        addEndpoint(res, {
          tags: ["Subscription"],
        });
      });
  });

  it("Map Subscription plan to nigerian market", () => {
    const getPlatinum = plans.filter(
      (plan) => plan.name.toLowerCase() === "auth-platinum"
    );
    const nigMarket = markets.filter(
      (market) => market.countryName.toLowerCase() === "nigeria"
    );

    const priceAMonth = 1999.99;

    return request(app.getHttpServer())
      .post("/subscription/create-plan-price")
      .send({
        planId: getPlatinum[0].id,
        marketId: nigMarket[0].id,
        freePlanPriceInDays: 7,
        priceAMonth,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data.priceAMonth !== priceAMonth) {
          throw new Error("Wrong price gotten.");
        }

        if (
          res.body.message !== SubcriptionPlanStatusMessage.plan.priceCreated
        ) {
          throw new Error("Invalid message response.");
        }
        priceIds.priceId1 = res.body.data.id;
        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Map Subscription plan to US market", () => {
    const getPlatinum = plans.filter(
      (plan) => plan.name.toLowerCase() === "auth-platinum-us"
    );

    const usMarket = markets.filter((market) => market.countryCode === "US");

    const priceAMonth = 10;

    return request(app.getHttpServer())
      .post("/subscription/create-plan-price")
      .send({
        planId: getPlatinum[0].id,
        marketId: usMarket[0].id,
        freePlanPriceInDays: 7,
        priceAMonth,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data.priceAMonth !== priceAMonth) {
          throw new Error("Wrong price gotten.");
        }

        if (
          res.body.message !== SubcriptionPlanStatusMessage.plan.priceCreated
        ) {
          throw new Error("Invalid message response.");
        }
        priceIds.priceId2 = res.body.data.id;

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Get all price plans", () => {
    return request(app.getHttpServer())
      .get("/subscription/admin-get-plans")

      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data.length !== 2) {
          throw new Error("Wrong price gotten.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.default) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Get all price plans in a market", () => {
    const usMarket = markets.filter((market) => market.countryCode === "US");
    return request(app.getHttpServer())
      .get("/subscription/admin-get-plans?marketId=" + usMarket[0].id)

      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data.length != 1) {
          throw new Error("Wrong price gotten.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.default) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
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

  it("Get Plans", () => {
    nockIpStackRequest();
    return request(app.getHttpServer())
      .get("/subscription/plans")
      .send({ trial_count: 0 })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        console.log(res.body.data);
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.default) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Sunscription"],
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

  it("Delete subscription price 1", () => {
    return request(app.getHttpServer())
      .delete("/subscription/price/" + priceIds.priceId1)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !== SubcriptionPlanStatusMessage.plan.PriceDeleted
        ) {
          throw new Error("Invalid message response.");
        }
        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Delete subscription price 2", () => {
    return request(app.getHttpServer())
      .delete("/subscription/price/" + priceIds.priceId2)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        console;
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !== SubcriptionPlanStatusMessage.plan.PriceDeleted
        ) {
          throw new Error("Invalid message response.");
        }
        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });

  it("Delete subscription plan", () => {
    return request(app.getHttpServer())
      .delete("/subscription/plan/" + planId)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== SubcriptionPlanStatusMessage.plan.deleted) {
          throw new Error("Invalid message response.");
        }
        addEndpoint(res, {
          tags: ["Admin"],
        });
      });
  });
});
