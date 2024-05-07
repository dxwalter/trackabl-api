import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PaymentTransactionStatusMessage } from "../config/paymentTransaction-response-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}

export class UserDoesNotExists extends BadRequestException {
  constructor() {
    super(PaymentTransactionStatusMessage.user.doesNotExist);
  }
}

export class UncomfirmedPayment extends BadRequestException {
  constructor() {
    super(PaymentTransactionStatusMessage.payment.failedVerification);
  }
}
