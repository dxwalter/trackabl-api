import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { MarketModel } from "./model/market.model";
import { SubscriptionMarketPricesModel } from "./model/subcription-market-price";
import { SubcriptionPlanModel } from "./model/subscription-plans.model";
@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [
    SequelizeModule.forFeature([
      MarketModel,
      SubscriptionMarketPricesModel,
      SubcriptionPlanModel,
    ]),
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
