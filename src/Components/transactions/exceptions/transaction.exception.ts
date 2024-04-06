import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { TransactionResponseMessages } from "../config/transactions-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}
export class TokenNotFound extends BadRequestException {
  constructor() {
    super(TransactionResponseMessages.systemToken.TokenNotFound);
  }
}

export class FailedToCreateTempWallet extends BadRequestException {
  constructor() {
    super(
      TransactionResponseMessages.temporalWallet.failedToCreateTemporalWallet
    );
  }
}

export class FailedToUpdateTemporaryDeposit extends BadRequestException {
  constructor() {
    super(
      TransactionResponseMessages.temporalWallet.failedToUpdateTemporalWallet
    );
  }
}
