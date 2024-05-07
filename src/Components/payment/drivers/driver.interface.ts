import {
  InitiatePaystackTransactionResponse,
  verifyPaystackTransactionResponse,
  PaystackWebhookPayload,
} from "../../utils/types/api.types";
import { defaultApiResponse } from "../types/transactions.types";
export interface PaymentDriver {
  pay(amount: number): any;

  verify(reference: string): verifyPaystackTransactionResponse | any;

  initializeTransaction(
    userId: number,
    marketPriceId: number,
    numberOfMonths: number
  ): InitiatePaystackTransactionResponse | any;

  createSubscriptionPlan(
    data: PaystackWebhookPayload | any
  ): Promise<defaultApiResponse>;
}
