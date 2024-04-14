import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { Utils } from "../utils/index";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { SubcriptionPlanModel } from "./model/subscription-plans.model";
import { MarketModel } from "./model/market.model";
import { createSubscriptionPlan } from "./types/price.types";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(SubcriptionPlanModel)
    private readonly subscriptionModel: typeof SubcriptionPlanModel,
    @InjectModel(MarketModel)
    private readonly marketModel: typeof MarketModel,
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
}
