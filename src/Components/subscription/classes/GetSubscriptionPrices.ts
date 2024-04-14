import { SubscriptionService } from "../subscription.service";
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import {
  createSubscriptionPlanResponse,
  deleteSubscrptionResponse,
  getMarketsResponse,
  getPlansResponse,
} from "../types/price.types";
import { CreatePricePlanDTO } from "../dto/price.dto";
import { SubscriptionPlanExists } from "../exception/subscription.exception";
import { SubcriptionPlanStatusMessage } from "../config/subscription-response-message";

export class GetSubscriptionPlanPrices {
  constructor(
    protected readonly subscription: SubscriptionService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService
  ) {}
}
