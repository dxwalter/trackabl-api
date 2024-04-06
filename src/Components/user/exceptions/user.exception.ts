import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { UserStatusMessages } from "../config/user-response-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}
export class MaximumTrialCount extends BadRequestException {
  constructor() {
    super(UserStatusMessages.CreateAccount.maximumTrial);
  }
}

export class EmailExists extends BadRequestException {
  constructor() {
    super(UserStatusMessages.CreateAccount.email_exists);
  }
}

export class PhoneNumberExists extends BadRequestException {
  constructor() {
    super(UserStatusMessages.CreateAccount.phoneNumberExists);
  }
}

export class InvalidEmailException extends BadRequestException {
  constructor() {
    super(UserStatusMessages.CreateAccount.invalidEmail);
  }
}

export class FailedLoginAttempException extends BadRequestException {
  constructor() {
    super(UserStatusMessages.Login.failed);
  }
}

export class InvalidEmailVerificationTokenException extends BadRequestException {
  constructor() {
    super(UserStatusMessages.EmailVerification.invalidToken);
  }
}
export class Failed2FAVerificationException extends BadRequestException {
  constructor() {
    super(UserStatusMessages.TwoFactorAuthentication.failedVerification);
  }
}

export class IncorrectPasswordException extends BadRequestException {
  constructor() {
    super(UserStatusMessages.UserActions.incorrectPassword);
  }
}

export class NoNewDataToBeUpdated extends BadRequestException {
  constructor() {
    super(UserStatusMessages.UserActions.noNewData);
  }
}

export class InvalidTransactionPinLength extends BadRequestException {
  constructor() {
    super(UserStatusMessages.UserActions.wrongTransactionPinlength);
  }
}

export class InvalidTransactionPin extends BadRequestException {
  constructor() {
    super(UserStatusMessages.UserActions.incorrectTransactionPin);
  }
}
