import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { Utils } from "../utils/index";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import {
  createSubscriptionPlan,
  createUserSubscription,
} from "./types/price.types";
import { SubcriptionPlanModel } from "./model/subscription-plans.model";
import { MarketModel } from "./model/market.model";
import { IPStackLookupModel } from "./model/ipstack-lookups.model";
import { SubscriptionMarketPricesModel } from "./model/subcription-market-price.model";
import { UserSubscriptionModel } from "./model/user-subscriptions.model";
import { CreatePricePlan } from "./dto/create-price-plan.dto";
import { StoreIPStackResponse } from "./dto/generic-subscription.dto";
import { Op } from "sequelize";
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(SubcriptionPlanModel)
    private readonly subscriptionModel: typeof SubcriptionPlanModel,
    @InjectModel(MarketModel)
    private readonly marketModel: typeof MarketModel,
    @InjectModel(IPStackLookupModel)
    private readonly ipStackModel: typeof IPStackLookupModel,
    @InjectModel(SubscriptionMarketPricesModel)
    private readonly subscriptionMarketPriceModel: typeof SubscriptionMarketPricesModel,
    @InjectModel(UserSubscriptionModel)
    private readonly userSubscrptionPlan: typeof UserSubscriptionModel,
    protected eventEmitter: EventEmitter2
  ) {}

  async getPlanUsingName(name: string): Promise<SubcriptionPlanModel | null> {
    try {
      return await this.subscriptionModel.findOne({
        where: {
          name,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking retrieving plan with name: ${name}`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.getPlanUsingName",
          payload: name,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting plan");
    }
  }

  async createSubscriptionPlan(
    data: createSubscriptionPlan
  ): Promise<SubcriptionPlanModel> {
    try {
      return await this.subscriptionModel.create({ ...data });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking creating subscription plan`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.createSubscriptionPlan",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred creating subscription plan"
      );
    }
  }

  async deleteSubscriptionPlan(id: number): Promise<void> {
    try {
      await this.subscriptionModel.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking deleting subscription plan with ID: ${id}`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.deleteSubscriptionPlan",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred deleting subscription plan"
      );
    }
  }

  async getAllMarkets(): Promise<MarketModel[]> {
    try {
      return await this.marketModel.findAll();
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to get all markets`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.getAllMarkets",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting all markets");
    }
  }
  async getAllPlans(): Promise<SubcriptionPlanModel[]> {
    try {
      return await this.subscriptionModel.findAll();
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to get all plans`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.getAllPlans",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting all plans");
    }
  }

  async getUserSubscriptionList(
    userId: number
  ): Promise<UserSubscriptionModel[]> {
    try {
      return await this.userSubscrptionPlan.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: MarketModel,
          },
          {
            model: SubcriptionPlanModel,
          },
          {
            model: SubscriptionMarketPricesModel,
          },
        ],
        attributes: {
          exclude: ["paymentProviderDetails"],
        },
        order: [['id', 'DESC']],
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to get previous subscriptions`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.getUserSubscriptionList",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred previous subscriptions");
    }
  }

  async getPriceInMarket(
    market: number,
    plan: number
  ): Promise<SubscriptionMarketPricesModel | null> {
    try {
      return await this.subscriptionMarketPriceModel.findOne({
        where: {
          [Op.and]: [{ planId: plan }, { marketId: market }],
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to get plan price for market`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.getPriceInMarket",
          payload: {
            market,
            plan,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting the plan");
    }
  }

  async createPriceForAmarket(
    data: CreatePricePlan
  ): Promise<SubscriptionMarketPricesModel> {
    try {
      return await this.subscriptionMarketPriceModel.create({
        ...data,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to create price for a market`,
        severity: "HIGH",
        details: {
          service: "SubscriptionService.createPriceForAmarket",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred creating a price for this market"
      );
    }
  }

  async createUserSubscripton(
    data: createUserSubscription
  ): Promise<UserSubscriptionModel> {
    try {
      return await this.userSubscrptionPlan.create({
        ...data,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to create user subscription`,
        severity: "HIGH",
        details: {
          service: "SubscriptionService.createUserSubscripton",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred creating your subscription plan."
      );
    }
  }

  async updateUserSubscriptionPlanStatus(userId: number, isActive: boolean) {
    try {
      return await this.userSubscrptionPlan.update(
        { isActive },
        {
          where: { userId },
        }
      );
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error updating user's subscription status : ${userId}`,
        severity: "HIGH",
        details: {
          service: "UserService.updateUserSubscriptionPlanStatus",
          payload: {
            userId: userId,
            isActive,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred updating your subscription status"
      );
    }
  }

  async getAllPrice(
    market: number | undefined = undefined
  ): Promise<SubscriptionMarketPricesModel[]> {
    try {
      const include = [
        {
          model: MarketModel,
        },
        {
          model: SubcriptionPlanModel,
        },
      ];
      return market
        ? await this.subscriptionMarketPriceModel.findAll({
            where: {
              marketId: market,
            },
            include,
          })
        : await this.subscriptionMarketPriceModel.findAll({
            include,
          });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Unable to get price for all market`,
        severity: "HIGH",
        details: {
          service: "SubscriptionService.getAllPrice",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred getting price for all market"
      );
    }
  }

  async getPriceUsingID(
    id: number
  ): Promise<SubscriptionMarketPricesModel | null> {
    try {
      const include = [
        {
          model: MarketModel,
        },
        {
          model: SubcriptionPlanModel,
        },
      ];

      return await this.subscriptionMarketPriceModel.findOne({
        where: {
          id: id,
        },
        include,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting price`,
        severity: "HIGH",
        details: {
          service: "SubscriptionService.getPriceUsingID",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting price");
    }
  }

  async deleteSubscriptionPlanPrice(id: number): Promise<void> {
    try {
      await this.subscriptionMarketPriceModel.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking deleting subscription plan price with ID: ${id}`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.deleteSubscriptionPlanPrice",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred deleting subscription plan price"
      );
    }
  }

  async getIpStackRecordUsingUserId(
    id: number
  ): Promise<IPStackLookupModel | null> {
    try {
      return await this.ipStackModel.findOne({
        where: {
          userId: id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking getting IPstack data using:  ${id}`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.getIpStackRecordUsingUserId",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      return null;
    }
  }

  async storeIpStackResponse(data: StoreIPStackResponse): Promise<void> {
    try {
      await this.ipStackModel.create({ ...data });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error storing IP Stack response`,
        severity: "MEDIUM",
        details: {
          service: "SubscriptionService.storeIpStackResponse",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);
    }
  }
}
