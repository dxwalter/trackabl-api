import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { SubcriptionPlanStatusMessage } from "../config/subscription-response-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}

export class SubscriptionPlanExists extends BadRequestException {
  constructor() {
    super(SubcriptionPlanStatusMessage.plan.exist);
  }
}

export class SubscriptionPlanPriceExists extends BadRequestException {
  constructor() {
    super(SubcriptionPlanStatusMessage.plan.priceExists);
  }
}

export class SubscriptionPlanPriceDoesNotExist extends BadRequestException {
  constructor() {
    super(SubcriptionPlanStatusMessage.plan.priceDoesNotExist);
  }
}
