import { BadRequestException } from "@nestjs/common";
import { WaitlistStatusMessages } from "../config/waitlist-status-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}
export class MaximumTrialCount extends BadRequestException {
  constructor() {
    super(WaitlistStatusMessages.JoinWaitlist.maximumTrial);
  }
}

export class EmailExistsInWaitlist extends BadRequestException {
  constructor() {
    super(WaitlistStatusMessages.JoinWaitlist.email_exists);
  }
}

export class InvalidEmailException extends BadRequestException {
  constructor() {
    super(WaitlistStatusMessages.JoinWaitlist.invalidEmail);
  }
}
