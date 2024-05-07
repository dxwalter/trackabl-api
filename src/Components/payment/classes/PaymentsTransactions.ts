import { PaystackService } from "../drivers/paystack";
import { StripeService } from "../drivers/stripe";
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import { PaymentTransactionStatusMessage } from "../config/paymentTransaction-response-message";
import {
  GenerateTransactionResponse,
  defaultApiResponse,
} from "../types/transactions.types";
import { PaystackWebhookPayload } from "../../utils/types/api.types";
import { InitializeTransactionDTO } from "../dto/create-webhook.dto";
import { SubscriptionService } from "../../subscription/subscription.service";

import { APIs } from "../../utils/apis";
import { UserService } from "../../user/user.service";

export class SubscriptionPricePlan {
  constructor(
    protected readonly subscriptionService: SubscriptionService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService,
    private readonly apis: APIs,
    private readonly userService: UserService
  ) {}

  async initializeTransaction(data: {
    userId: number;
    driver: string;
    marketPriceId: number;
    numberOfMonths: number;
  }): Promise<GenerateTransactionResponse | any> {
    if (data.driver.toLowerCase() === "paystack")
      return new PaystackService(
        this.apis,
        this.subscriptionService,
        this.userService
      ).initializeTransaction(
        data.userId,
        data.marketPriceId,
        data.numberOfMonths
      );
  }

  async inititateSubscriptionCreation(
    data: PaystackWebhookPayload,
    driver: string
  ): Promise<defaultApiResponse> {
    if (driver.toLowerCase() === "paystack") {
      return await new PaystackService(
        this.apis,
        this.subscriptionService,
        this.userService
      ).createSubscriptionPlan(data);
    }

    return {
      status: true,
      message: "",
    };
  }
}
