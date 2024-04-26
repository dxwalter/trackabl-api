import * as dayjs from "dayjs";
import { SubscriptionService } from "../subscription.service";
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import {
  createSubscriptionPlanResponse,
  deleteSubscrptionResponse,
  getMarketsResponse,
  getPlansResponse,
  activateFreePlanResponse,
  UserSubscription,
  userSubscriptionListResponse,
} from "../types/price.types";
import { CreatePricePlanDTO } from "../dto/price.dto";
import { ActivateFreeSubscriptionPlanDto } from "../dto/create-subscription.dto";
import {
  SubscriptionPlanExists,
  SubscriptionPlanPriceDoesNotExist,
} from "../exception/subscription.exception";
import { SubcriptionPlanStatusMessage } from "../config/subscription-response-message";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DayInSeconds } from "../types/constants";
import { UserService } from "../../user/user.service";

export class SubscriptionPlan {
  constructor(
    protected readonly subscription: SubscriptionService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService,
    protected eventEmitter: EventEmitter2,
    protected userService: UserService
  ) {}

  async create(
    payload: CreatePricePlanDTO
  ): Promise<createSubscriptionPlanResponse> {
    // check if paln exists
    const checkPlan = await this.subscription.getPlanUsingName(payload.name);

    if (checkPlan) {
      throw new SubscriptionPlanExists();
    }

    const createPlan = await this.subscription.createSubscriptionPlan({
      name: payload.name,
      status: payload.status,
    });

    // create plan
    return {
      status: true,
      message: SubcriptionPlanStatusMessage.plan.created,
      data: {
        id: createPlan.id,
        name: createPlan.name,
        status: createPlan.status,
        createdAt: createPlan.createdAt,
        updatedAt: createPlan.updatedAt,
      },
    };
  }

  async delete(payload: number): Promise<deleteSubscrptionResponse> {
    await this.subscription.deleteSubscriptionPlan(payload);
    return {
      status: true,
      message: SubcriptionPlanStatusMessage.plan.deleted,
    };
  }

  async getAllMarkets(): Promise<getMarketsResponse> {
    return {
      status: true,
      message: SubcriptionPlanStatusMessage.default,
      data: await this.subscription.getAllMarkets(),
    };
  }

  async getAllPlans(): Promise<getPlansResponse> {
    return {
      status: true,
      message: SubcriptionPlanStatusMessage.default,
      data: await this.subscription.getAllPlans(),
    };
  }

  async activateFreeSubscriptionPlan(
    req: any,
    data: ActivateFreeSubscriptionPlanDto
  ): Promise<activateFreePlanResponse> {
    const userId = req.user.id;

    const planId = data.planId;
    const priceId = data.priceId;

    const getPlan = await this.subscription.getPriceUsingID(priceId);
    if (!getPlan) {
      throw new SubscriptionPlanPriceDoesNotExist();
    }

    const startDateInUnix = dayjs().unix();
    const endDateInUnix =
      startDateInUnix + DayInSeconds * getPlan.freePlanPriceInDays;

    const startDate = dayjs(startDateInUnix * 1000).format("YYYY-MM-DD");
    const endDate = dayjs(endDateInUnix * 1000).format("YYYY-MM-DD");

    const updateSubscriptionStatus =
      await this.subscription.updateUserSubscriptionPlanStatus(userId, false);

    // console.log(updateSubscriptionStatus);

    const createPlan: UserSubscription =
      await this.subscription.createUserSubscripton({
        endDate: new Date(endDate),
        endDateInUnix: endDateInUnix,
        isActive: true,
        marketId: getPlan.marketId,
        paymentProviderDetails: {},
        planId: getPlan.planId,
        priceMarketId: getPlan.id,
        startDate: new Date(startDate),
        startDateInUnix: startDateInUnix,
        userId: userId,
      });

    const newSubscriptionPlan = this.utils.plainSequelizeObject(createPlan);

    // update user status
    await this.userService.updateUserProfile(userId, {
      activeSubscriptionId: newSubscriptionPlan.id,
      isSubscriptionActive: true,
    });

    // send

    return {
      status: true,
      message: SubcriptionPlanStatusMessage.user.freePlanActivated,
      data: {
        ...newSubscriptionPlan,
        paymentProviderDetails: undefined,
      },
    };
  }

  async listUserSubscriptions(req: any): Promise<userSubscriptionListResponse> {
    const userId = req.user.id;
    return {
      status: true,
      message: SubcriptionPlanStatusMessage.default,
      data: await this.subscription.getUserSubscriptionList(userId),
    };
  }
}
