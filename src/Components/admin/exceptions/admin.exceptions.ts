import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { AdminStatusMessages } from "../config/admin-response-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}

export class EmailExists extends BadRequestException {
  constructor() {
    super(AdminStatusMessages.CreateAccount.email_exists);
  }
}

export class FailedLoginAttempForAdmin extends BadRequestException {
  constructor() {
    super(AdminStatusMessages.Login.error);
  }
}
