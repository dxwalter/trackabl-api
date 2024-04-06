import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TransactionsService } from "../transactions/transactions.service";

import { SystemTokenModel } from "../transactions/models/system-tokens.model";
import { TemporaryRemittanceModel } from "../transactions/models/temporary-remittances.model";
import { Utils } from "../utils";
import { GlobalErrorService } from "../globals/global.error.service";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";

import { TokenWalletHistory } from "../history/models/token-wallet-history";
import { HistoryService } from "../history/history.service";

import { SystemErrorLogs } from "../globals/model/error-logs.model";

@Module({
  controllers: [WebhookController],
  providers: [
    WebhookService,
    TransactionsService,
    Utils,
    GlobalErrorService,
    PlatformFeatureStatusService,
    HistoryService,
  ],
  exports: [
    Utils,
    GlobalErrorService,
    PlatformFeatureStatusService,
    HistoryService,
  ],
  imports: [
    SequelizeModule.forFeature([
      SystemTokenModel,
      PlatformFeatureStatus,
      TemporaryRemittanceModel,
      TokenWalletHistory,
      SystemErrorLogs,
    ]),
  ],
})
export class WebhookModule {}
