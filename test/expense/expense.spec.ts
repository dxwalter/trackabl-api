/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomEmail = require("random-email");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addEndpoint, renderDocumentation } = require("../setup/documentation");
import * as dayjs from "dayjs";
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
import { CategoryStatusMessages } from "../../src/Components/category/config/category-response-messages";
import {
  CategoryTypeForAdmin,
  SubcategoriesForAdmin,
} from "../../src/Components/category/types/category-types";
import { generateRandomColor } from "../setup/global-function";
import { UserStatusMessages } from "../../src/Components/user/config/user-response-message";
import { ExpenseStatusMessages } from "../../src/Components/expense/config/expense-response-messages";

dotenv.config();

describe("Expense (e2e)", () => {
  let app: INestApplication;
  const userEmail: string = randomEmail();
  let referralCode: string | undefined = undefined;
  const referredUser: string = randomEmail();
  let waitlistId: number | undefined = undefined;
  const utils = new Utils();
  const randomPassword = utils.generateRandomString(7);
  const newUpdatedPassword = utils.generateRandomString(7);

  let adminToken = undefined;
  let adminTokenTwo = undefined;
  let emailVerificationCode = undefined;
  let passwordResetCode = undefined;
  let userId = 0;
  let featureId = undefined;

  let categoryOne: CategoryTypeForAdmin | null = null;
  let categoryTwo: CategoryTypeForAdmin | null = null;
  let suggestedCategoryId: number | null = null;
  let suggestedSubcategoryId: number | null = null;

  let userToken = undefined;

  const categoryAndSubcategories: CategoryTypeForAdmin[] = [];
  let currencies: any[] = [];

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

        adminToken = res.body.data.token;
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
      .set("Authorization", `Bearer ${adminToken}`)
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

  it("Create a category", () => {
    const directoryPath = path.join(
      __dirname,
      "../setup/files/category_icon.svg"
    );

    return request(app.getHttpServer())
      .post("/category/create-category")
      .attach("icon", directoryPath)
      .field("name", "New_Category" + randomEmail().split("@")[0])
      .field("color", generateRandomColor())
      .field("setActive", true)
      .field("isUserDefinedCategory", false)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== CategoryStatusMessages.Create.success) {
          throw new Error("Invalid message response.");
        }

        categoryOne = res.body.data;

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Create a category", () => {
    const directoryPath = path.join(
      __dirname,
      "../setup/files/category_icon.svg"
    );

    return request(app.getHttpServer())
      .post("/category/create-category")
      .attach("icon", directoryPath)
      .field("name", "New_Category" + randomEmail().split("@")[0])
      .field("color", generateRandomColor())
      .field("setActive", true)
      .field("isUserDefinedCategory", false)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== CategoryStatusMessages.Create.success) {
          throw new Error("Invalid message response.");
        }

        categoryTwo = res.body.data;

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Make category inactive", () => {
    return request(app.getHttpServer())
      .patch("/category/active-status/" + categoryOne?.id)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== CategoryStatusMessages.Update.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  [1, 2, 3, 4].forEach(async (element) => {
    it("Create 4 subcategories - " + element, () => {
      return request(app.getHttpServer())
        .post("/category/create-subcategory/" + categoryOne?.id)
        .send({
          name: element + "New_Subcategory" + randomEmail().split("@")[0],
          color: generateRandomColor(),
          isUserDefinedSubcategory: false,
          isSubcategoryActive: true,
          userId: null,
        })
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept", "application/json")
        .expect(function (res) {
          if (!("message" in res.body)) {
            throw new Error("Response should contain message.");
          }

          if (res.body.message !== CategoryStatusMessages.Subcategory.success) {
            throw new Error("Invalid message response.");
          }

          addEndpoint(res, {
            tags: ["Category"],
          });
        });
    });
  });

  [1, 2, 3, 4, 5, 6, 7].forEach(async (element) => {
    it("Create 4 subcategories - " + element, () => {
      return request(app.getHttpServer())
        .post("/category/create-subcategory/" + categoryTwo?.id)
        .send({
          name: element + "New_Subcategory" + randomEmail().split("@")[0],
          color: generateRandomColor(),
          isUserDefinedSubcategory: false,
          isSubcategoryActive: true,
          userId: null,
        })
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept", "application/json")
        .expect(function (res) {
          if (!("message" in res.body)) {
            throw new Error("Response should contain message.");
          }

          if (res.body.message !== CategoryStatusMessages.Subcategory.success) {
            throw new Error("Invalid message response.");
          }

          addEndpoint(res, {
            tags: ["Category"],
          });
        });
    });
  });

  it("Get categories and corresponding subcategories", () => {
    return request(app.getHttpServer())
      .get("/category/admin-get-category/")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.data[0].subcategories.length < 4) {
          throw new Error("The wrong amount of subcatgories was gotten.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.message !== CategoryStatusMessages.default) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
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

  it("Get categories and corresponding All and subcategories for custmer", () => {
    return request(app.getHttpServer())
      .get("/category")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.data[0].subcategories.length < 4) {
          throw new Error("The wrong amount of subcatgories was gotten.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.message !== CategoryStatusMessages.default) {
          throw new Error("Invalid message response.");
        }

        res.body.data.forEach((element) => {
          categoryAndSubcategories.push(element);
        });

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Get all currencies", () => {
    return request(app.getHttpServer())
      .get("/expense/currencies")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (!("data" in res.body)) {
          throw new Error("Response should contain data.");
        }

        if (res.body.data[0].length > 0) {
          throw new Error("The wrong amount of subcatgories was gotten.");
        }

        if (res.body.message !== ExpenseStatusMessages.default) {
          throw new Error("Invalid message response.");
        }

        currencies = res.body.data;

        addEndpoint(res, {
          tags: ["Expense"],
        });
      });
  });

  it("Create a new expense: Failed due to file type", () => {
    const category =
      categoryAndSubcategories[
        utils.generateTokenWithRange(0, categoryAndSubcategories.length)
      ];

    const subcategories: SubcategoriesForAdmin[] | undefined =
      category.subcategories ?? [];

    const selectedSubcategory =
      subcategories[utils.generateTokenWithRange(0, subcategories.length)];

    const currency = currencies.filter(
      (currency) => currency.currencyCode === "NGN"
    )[0];

    const directoryPath = path.join(
      __dirname,
      "../setup/files/category_icon.svg"
    );
    return request(app.getHttpServer())
      .post("/expense")
      .attach("receipt", directoryPath)
      .field("categoryId", category.id)
      .field("currencyId", currency.id)
      .field("amount", 10000)
      .field("subcategoryId", selectedSubcategory.id)
      .field("expenseDate", dayjs().format("DD/MM/YYYY"))
      .field(
        "note",
        "Nullam accumsan lorem in dui. Fusce convallis metus id felis luctus adipiscing. Donec venenatis vulputate lorem. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Morbi mattis ullamcorper velit."
      )
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }
        if (
          res.body.message !== ".PNG, .JPEG, .JPG are the allowed file types"
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Expense"],
        });
      });
  });

  it("Create a new expense", () => {
    const category =
      categoryAndSubcategories[
        utils.generateTokenWithRange(0, categoryAndSubcategories.length)
      ];

    const subcategories: SubcategoriesForAdmin[] | undefined =
      category.subcategories ?? [];

    const selectedSubcategory =
      subcategories[utils.generateTokenWithRange(0, subcategories.length)];

    const currency = currencies.filter(
      (currency) => currency.currencyCode === "NGN"
    )[0];

    const directoryPath = path.join(__dirname, "../setup/files/receipt.jpg");
    return request(app.getHttpServer())
      .post("/expense")
      .attach("receipt", directoryPath)
      .field("categoryId", category.id)
      .field("currencyId", currency.id)
      .field("amount", 10000)
      .field("subcategoryId", selectedSubcategory.id)
      .field("expenseDate", dayjs().format("DD/MM/YYYY"))
      .field(
        "note",
        "Nullam accumsan lorem in dui. Fusce convallis metus id felis luctus adipiscing. Donec venenatis vulputate lorem. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Morbi mattis ullamcorper velit."
      )
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }
        if (res.body.message !== ExpenseStatusMessages.Create.success) {
          throw new Error("Invalid message response.");
        }

        if (
          res.body.data.receipt.length === 0 ||
          res.body.data.receipt.length === undefined
        ) {
          throw new Error("Response should contain receipt url.");
        }

        addEndpoint(res, {
          tags: ["Expense"],
        });
      });
  });

  it("User suggests category", () => {
    return request(app.getHttpServer())
      .post("/category/suggestion")
      .send({
        name: "New_Suggested_Category" + randomEmail().split("@")[0],
        description:
          "Nullam accumsan lorem in dui. Fusce convallis metus id felis luctus adipiscing. Donec venenatis vulputate lorem. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Morbi mattis ullamcorper velit.",
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
          CategoryStatusMessages.Suggestions.category.create
        ) {
          throw new Error("Invalid message response.");
        }

        suggestedCategoryId = res.body.data.id;

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Admin List suggested categories to be approved", () => {
    return request(app.getHttpServer())
      .get("/category/suggestion")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.data.length < 1) {
          throw new Error("There should be at least one suggested category.");
        }

        if (res.body.message !== CategoryStatusMessages.default) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Deleted suggested category", () => {
    return request(app.getHttpServer())
      .delete("/category/suggestion/" + suggestedCategoryId)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !==
          CategoryStatusMessages.Suggestions.category.delete
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("User suggests public subcategory", () => {
    return request(app.getHttpServer())
      .post("/category/subcategory-suggestion")
      .send({
        name: "New_Suggested_Category" + randomEmail().split("@")[0],
        description:
          "Nullam accumsan lorem in dui. Fusce convallis metus id felis luctus adipiscing. Donec venenatis vulputate lorem. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Morbi mattis ullamcorper velit.",
        categoryId: categoryOne?.id,
        isPublic: true,
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
          CategoryStatusMessages.Suggestions.subcategory.create
        ) {
          throw new Error("Invalid message response.");
        }

        suggestedSubcategoryId = res.body.data.id;

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("User suggests private subcategory", () => {
    return request(app.getHttpServer())
      .post("/category/subcategory-suggestion")
      .send({
        name: "New_Suggested_Category" + randomEmail().split("@")[0],
        description:
          "Nullam accumsan lorem in dui. Fusce convallis metus id felis luctus adipiscing. Donec venenatis vulputate lorem. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Morbi mattis ullamcorper velit.",
        categoryId: categoryOne?.id,
        isPublic: false,
        trial_count: 0,
      })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.message !== CategoryStatusMessages.Subcategory.success) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Admin List suggested subcategories to be approved", () => {
    return request(app.getHttpServer())
      .get("/category/subcategory-suggestion")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (res.body.data.length < 1) {
          throw new Error("There should be at least one suggested category.");
        }

        if (res.body.message !== CategoryStatusMessages.default) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });

  it("Deleted suggested subcategory", () => {
    return request(app.getHttpServer())
      .delete("/category/subcategory-suggestion/" + suggestedSubcategoryId)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(function (res) {
        if (!("message" in res.body)) {
          throw new Error("Response should contain message.");
        }

        if (
          res.body.message !==
          CategoryStatusMessages.Suggestions.subcategory.delete
        ) {
          throw new Error("Invalid message response.");
        }

        addEndpoint(res, {
          tags: ["Category"],
        });
      });
  });
});
