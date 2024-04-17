import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { MarketModel } from "./model/market.model";
import { SubscriptionMarketPricesModel } from "./model/subcription-market-price";
import { SubcriptionPlanModel } from "./model/subscription-plans.model";
import { IPStackLookupModel } from "./model/ipstack-lookups.model";
import { APIs } from "../utils/apis";
@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, APIs],
  imports: [
    SequelizeModule.forFeature([
      MarketModel,
      SubscriptionMarketPricesModel,
      SubcriptionPlanModel,
      IPStackLookupModel,
    ]),
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
