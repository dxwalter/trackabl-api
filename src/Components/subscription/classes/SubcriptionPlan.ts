import { SubscriptionService } from "../subscription.service";
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import {
  createSubscriptionPlanResponse,
  deleteSubscrptionResponse,
} from "../types/price.types";
import { CreatePricePlanDTO } from "../dto/price.dto";
import { SubscriptionPlanExists } from "../exception/subscription.exception";
import { SubcriptionPlanStatusMessage } from "../config/subscription-response-message";

export class SubscriptionPlan {
  constructor(
    protected readonly subscription: SubscriptionService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService
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
}
