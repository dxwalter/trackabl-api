import { SubscriptionService } from "../subscription.service";
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import {
  createPriceResponse,
  deletePriceResponse,
  getAllMarketPriceResponse,
} from "../types/price.types";
import { SubscriptionPlanPriceExists } from "../exception/subscription.exception";
import { SubcriptionPlanStatusMessage } from "../config/subscription-response-message";
import { CreatePricePlan } from "../dto/create-price-plan.dto";
import { BadRequestException } from "@nestjs/common";

export class SubscriptionPricePlan {
  constructor(
    protected readonly subscriptionService: SubscriptionService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService
  ) {}

  async create(data: CreatePricePlan): Promise<createPriceResponse> {
    const getPlanPrice = await this.subscriptionService.getPriceInMarket(
      data.marketId,
      data.planId
    );

    if (getPlanPrice) {
      throw new SubscriptionPlanPriceExists();
    }

    return {
      status: true,
      message: SubcriptionPlanStatusMessage.plan.priceCreated,
      data: await this.subscriptionService.createPriceForAmarket(data),
    };
  }
  async delete(payload: number): Promise<deletePriceResponse> {
    try {
      await this.subscriptionService.deleteSubscriptionPlanPrice(payload);
      return {
        status: true,
        message: SubcriptionPlanStatusMessage.plan.PriceDeleted,
      };
    } catch (error) {
      throw new BadRequestException(
        "An error occurred deleting subscription price"
      );
    }
  }

  async deleteUserSubscription(payload: number): Promise<deletePriceResponse> {
    try {
      await this.subscriptionService.deleteUserSubscription(payload);
      return {
        status: true,
        message: SubcriptionPlanStatusMessage.user.deletePlan,
      };
    } catch (error) {
      throw new BadRequestException(
        "An error occurred deleting subscription price"
      );
    }
  }

  async getAllPrice(
    market: number | undefined
  ): Promise<getAllMarketPriceResponse> {
    return {
      status: true,
      message: SubcriptionPlanStatusMessage.default,
      data: await this.subscriptionService.getAllPrice(market),
    };
  }
}
