import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TransactionsService } from "../transactions/transactions.service";

import { SystemTokenModel } from "../transactions/models/system-tokens.model";
import { TemporaryRemittanceModel } from "../transactions/models/temporary-remittances.model";
import { Utils } from "../utils";
import { APIs } from "../utils/apis";
import { GlobalErrorService } from "../globals/global.error.service";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";

import { TokenWalletHistory } from "../history/models/token-wallet-history";
import { HistoryService } from "../history/history.service";

import { SystemErrorLogs } from "../globals/model/error-logs.model";
import { SubscriptionService } from "../subscription/subscription.service";
import { SubcriptionPlanModel } from "../subscription/model/subscription-plans.model";
import { MarketModel } from "../subscription/model/market.model";
import { IPStackLookupModel } from "../subscription/model/ipstack-lookups.model";
import { SubscriptionMarketPricesModel } from "../subscription/model/subcription-market-price.model";
import { UserSubscriptionModel } from "../subscription/model/user-subscriptions.model";
import { UserService } from "../user/user.service";
import { UserModel } from "../user/models/user.model";
import { UserSignUpPoints } from "../user/models/user-sign-up-points.model";

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    UserService,
    TransactionsService,
    Utils,
    APIs,
    GlobalErrorService,
    PlatformFeatureStatusService,
    HistoryService,
    SubscriptionService,
  ],
  exports: [
    Utils,
    APIs,
    GlobalErrorService,
    PlatformFeatureStatusService,
    HistoryService,
    SubscriptionService,
    UserService,
  ],
  imports: [
    SequelizeModule.forFeature([
      SystemTokenModel,
      PlatformFeatureStatus,
      TemporaryRemittanceModel,
      TokenWalletHistory,
      SystemErrorLogs,
      SubcriptionPlanModel,
      MarketModel,
      IPStackLookupModel,
      UserSubscriptionModel,
      SubscriptionMarketPricesModel,
      UserModel,
      UserSignUpPoints,
    ]),
  ],
})
export class PaymentModule {}
