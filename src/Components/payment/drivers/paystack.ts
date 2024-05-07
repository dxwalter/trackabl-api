import * as dayjs from "dayjs";
import { BadGatewayException } from "@nestjs/common";
import { PaymentDriver } from "./driver.interface";
import {
  GenerateTransactionResponse,
  defaultApiResponse,
} from "../types/transactions.types";
import { APIs } from "../../utils/apis";
import {
  verifyPaystackTransactionResponse,
  PaystackWebhookPayload,
} from "../../utils/types/api.types";
import { SubscriptionService } from "../../subscription/subscription.service";
import { UserService } from "../../user/user.service";
import { UserDoesNotExists } from "../exceptions/payment.exceptions";
import { PaymentTransactionStatusMessage } from "../config/paymentTransaction-response-message";
import { UncomfirmedPayment } from "../exceptions/payment.exceptions";
import { DayInSeconds } from "../../subscription/types/constants";
import { SubscriptionPlanPriceDoesNotExist } from "../../subscription/exception/subscription.exception";

export class PaystackService implements PaymentDriver {
  constructor(
    private readonly apis: APIs,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService
  ) {}
  pay(amount: number) {
    // Flutterwave API call to make or initialize payment as the case may be
    return `Payment of ${amount} made via flutterwave`;
  }

  async verify(reference: string): Promise<verifyPaystackTransactionResponse> {
    return await this.apis.verifyPaystackTransaction(reference);
  }

  async initializeTransaction(
    userId: number,
    marketPriceId: number,
    numberOfMonths: number
  ): Promise<GenerateTransactionResponse> {
    const userProfile = await this.userService.getUserProfileUsingID(userId);
    if (!userProfile) {
      throw new UserDoesNotExists();
    }

    const marketPricing =
      await this.subscriptionService.getPriceUsingID(marketPriceId);
    if (!marketPricing) {
      throw new BadGatewayException("Subscription plan does not exists");
    }

    const payload = {
      amount: marketPricing.priceAMonth * 100 * numberOfMonths,
      email: userProfile.email,
      metadata: JSON.stringify({
        plan: {
          userId,
          planId: marketPricing.planId,
          marketPriceId,
          numberOfMonths,
        },
      }),
    };

    const makeRequest = await this.apis.initializePaystackTransaction(payload);

    return {
      status: true,
      message: PaymentTransactionStatusMessage.default,
      data: {
        url: makeRequest.data.authorization_url,
      },
    };
  }

  async createSubscriptionPlan(
    data: PaystackWebhookPayload
  ): Promise<defaultApiResponse> {
    const PAYSTACK_SERVICE = new PaystackService(
      this.apis,
      this.subscriptionService,
      this.userService
    );
    const reference = data.data.reference;

    const verifyTransaction = await PAYSTACK_SERVICE.verify(reference);

    if (
      verifyTransaction.data.id !== data.data.id ||
      verifyTransaction.data.status.toLowerCase() !== "success"
    ) {
      throw new UncomfirmedPayment();
    }

    const getPlan = await this.subscriptionService.getPriceUsingID(
      verifyTransaction.data.metadata.plan.marketPriceId
    );
    if (!getPlan) {
      throw new SubscriptionPlanPriceDoesNotExist();
    }

    const startDateInUnix = dayjs().unix();
    const endDateInUnix =
      startDateInUnix +
      DayInSeconds * (verifyTransaction.data.metadata.plan.numberOfMonths ?? 1);

    const startDate = dayjs(startDateInUnix * 1000).format("YYYY-MM-DD");
    const endDate = dayjs(endDateInUnix * 1000).format("YYYY-MM-DD");

    // set previous plans to inactive for users
    const updateSubscriptionStatus =
      await this.subscriptionService.updateUserSubscriptionPlanStatus(
        verifyTransaction.data.metadata.plan.userId,
        false
      );

    //  create subscription
    const create = await this.subscriptionService.createUserSubscripton({
      endDate: new Date(endDate),
      endDateInUnix: endDateInUnix,
      isActive: true,
      marketId: getPlan.marketId,
      paymentProviderDetails: data,
      reference,
      paymentDetails: {
        provider: "paystack",
        amount: verifyTransaction.data.amount,
        numberOfMonths: verifyTransaction.data.metadata.plan.numberOfMonths,
        transactionId: verifyTransaction.data.id,
      },
      planId: getPlan.planId,
      priceMarketId: getPlan.id,
      startDate: new Date(startDate),
      startDateInUnix: startDateInUnix,
      userId: verifyTransaction.data.metadata.plan.userId,
    });

    // update user status
    await this.userService.updateUserProfile(
      verifyTransaction.data.metadata.plan.userId,
      {
        activeSubscriptionId: create.id,
        isSubscriptionActive: true,
      }
    );

    // send email

    // send response

    return {
      status: true,
      message: PaymentTransactionStatusMessage.payment.created,
      data: process.env.NODE_ENV === "test" ? create : undefined,
    };
  }
}
