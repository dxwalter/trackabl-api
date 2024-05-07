import { PaymentDriver } from "./driver.interface";
import {
  verifyPaystackTransactionResponse,
  PaystackWebhookPayload,
} from "../../utils/types/api.types";

import {
  GenerateTransactionResponse,
  defaultApiResponse,
} from "../types/transactions.types";

export class StripeService implements PaymentDriver {
  pay(amount: number) {
    // Flutterwave API call to make or initialize payment as the case may be
    return `Payment of ${amount} made via flutterwave`;
  }

  verify(reference: string) {
    // Flutterwave API call to verify the payment
    return `Payment verified via Flutterwave`;
  }

  initializeTransaction(userId: number, marketPriceId: number): any {
    // Flutterwave API call to verify the payment
    return `Payment verified via Flutterwave`;
  }

  async createSubscriptionPlan(
    data: PaystackWebhookPayload | any
  ): Promise<defaultApiResponse> {
    return await {
      status: true,
      message: "",
    };
  }
}
