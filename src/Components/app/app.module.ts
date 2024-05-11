import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MulterModule } from "@nestjs/platform-express";
import { HistoryModule } from "../history/history.module";
import { HistoryController } from "../history/history.controller";
import { HistoryService } from "../history/history.service";

import { WaitlistModule } from "../waitlist/waitlist.module";
import { WaitlistController } from "../waitlist/waitlist.controller";
import { WaitlistService } from "../waitlist/waitlist.service";

import { PaymentController } from "../payment/payment.controller";
import { PaymentService } from "../payment/payment.service";
import { PaymentModule } from "../payment/payment.module";

import { StatusController } from "../status/status.controller";
import { StatusService } from "../status/status.service";

import { TransactionsModule } from "../transactions/transactions.module";
import { TransactionsController } from "../transactions/transactions.controller";
import { TransactionsService } from "../transactions/transactions.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationController } from "../notification/notification.controller";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { AuthenticationController } from "../user/auth.controller";
import { UserModule } from "../user/user.module";
import { PlatformFeatureStatusModule } from "../platform-feature-status/platform-status.module";
import { PlatformFeatureStatusController } from "../platform-feature-status/platform-status.controller";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";

import { AdminController } from "../admin/admin.controller";
import { AdminService } from "../admin/admin.service";
import { AdminModule } from "../admin/admin.module";

import { SubscriptionController } from "../subscription/subscription.controller";
import { SubscriptionService } from "../subscription/subscription.service";
import { SubcriptionPlanModel } from "../subscription/model/subscription-plans.model";
import { MarketModel } from "../subscription/model/market.model";
import { SubscriptionMarketPricesModel } from "../subscription/model/subcription-market-price.model";
import { IPStackLookupModel } from "../subscription/model/ipstack-lookups.model";
import { UserSubscriptionModel } from "../subscription/model/user-subscriptions.model";

import { CategoryController } from "../category/category.controller";
import { CategoryService } from "../category/category.service";
import { SuggestedCategoryService } from "../category/category.suggestions.service";
import { CategoryModule } from "../category/category.module";

import { GlobalErrorService } from "../globals/global.error.service";
// import { GlobalLogService } from "../globals/global.log.service";
import { GlobalModule } from "../globals/global.module";

import { ExpenseModule } from "../expense/expense.module";
import { ExpenseController } from "../expense/expense.controller";
import { ExpenseService } from "../expense/expense.service";

import { CacheModule } from "@nestjs/cache-manager";

import { APIs } from "../utils/apis";

import { models as DatabaseModels } from "../../models";

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const DBHost = isProduction
  ? process.env.PRODUCTION_DATABASE_HOST
  : isTest
  ? process.env.TEST_DATABASE_HOST
  : process.env.DEVELOPMENT_DATABASE_HOST;

const DBUsername = isProduction
  ? process.env.PRODUCTION_DATABASE_USERNAME
  : isTest
  ? process.env.TEST_DATABASE_USERNAME
  : process.env.DEVELOPMENT_DATABASE_USERNAME;

const DBPassword = isProduction
  ? process.env.PRODUCTION_DATABASE_PASSWORD
  : isTest
  ? process.env.TEST_DATABASE_PASSWORD
  : process.env.DEVELOPMENT_DATABASE_PASSWORD;

const DBName = isProduction
  ? process.env.PRODUCTION_DATABASE_NAME
  : isTest
  ? process.env.TEST_DATABASE_NAME
  : process.env.DEVELOPMENT_DATABASE_NAME;

const port = isProduction
  ? process.env.PRODUCTION_DATABASE_PORT
  : process.env.DEVELOPMENT_DATABASE_PORT;

@Module({
  imports: [
    CacheModule.register(),
    MulterModule.register({
      dest: "../../../asset/file_uploads",
    }),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    SequelizeModule.forFeature(DatabaseModels),
    SequelizeModule.forRoot({
      dialect: "postgres",
      logging: false,
      host: DBHost,
      port: Number(port) ?? 0,
      username: DBUsername,
      password: DBPassword,
      database: DBName,
      ssl: false,
      dialectOptions: {
        ssl: false,
      },
      autoLoadModels: true,
      synchronize: false,
    }),
    forwardRef(() => WaitlistModule),
    forwardRef(() => UserModule),
    forwardRef(() => PlatformFeatureStatusModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => GlobalModule),
    forwardRef(() => AdminModule),
    forwardRef(() => SubcriptionPlanModel),
    forwardRef(() => SubscriptionMarketPricesModel),
    forwardRef(() => MarketModel),
    forwardRef(() => IPStackLookupModel),
    forwardRef(() => UserSubscriptionModel),
    forwardRef(() => CategoryModule),
    forwardRef(() => ExpenseModule),
  ],
  controllers: [
    WaitlistController,
    StatusController,
    NotificationController,
    AuthenticationController,
    UserController,
    PlatformFeatureStatusController,
    TransactionsController,
    PaymentController,
    HistoryController,
    AdminController,
    SubscriptionController,
    CategoryController,
    ExpenseController,
  ],
  providers: [
    WaitlistService,
    StatusService,
    NotificationService,
    UserService,
    GlobalErrorService,
    PlatformFeatureStatusService,
    TransactionsService,
    PaymentService,
    HistoryService,
    AdminService,
    SubscriptionService,
    APIs,
    CategoryService,
    SuggestedCategoryService,
    ExpenseService,
  ],
})
export class AppModule {}
