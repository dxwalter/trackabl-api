import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { SystemTokenModel } from "./models/system-tokens.model";
import { TemporaryRemittanceModel } from "./models/temporary-remittances.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { Utils } from "../utils";
import { GlobalErrorService } from "../globals/global.error.service";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";

import { TokenWalletHistory } from "../history/models/token-wallet-history";
import { HistoryService } from "../history/history.service";

import { SystemErrorLogs } from "../globals/model/error-logs.model";
@Module({
  controllers: [TransactionsController],
  providers: [
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
export class TransactionsModule {}
