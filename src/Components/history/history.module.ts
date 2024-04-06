import { Module } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { HistoryController } from "./history.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TokenWalletHistory } from "./models/token-wallet-history";
@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [SequelizeModule.forFeature([TokenWalletHistory])],
})
export class HistoryModule {}
