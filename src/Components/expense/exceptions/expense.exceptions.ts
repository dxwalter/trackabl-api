import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { ExpenseStatusMessages } from "../config/expense-response-messages";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}

export class CategoryRequiredException extends BadRequestException {
  constructor() {
    super(ExpenseStatusMessages.Error.category.required);
  }
}

export class CategoryNotFoundException extends BadRequestException {
  constructor() {
    super(ExpenseStatusMessages.Error.category.notFound);
  }
}

export class SubcategoryRequiredException extends BadRequestException {
  constructor() {
    super(ExpenseStatusMessages.Error.subcategory.required);
  }
}

export class SubcategoryNotFoundException extends BadRequestException {
  constructor() {
    super(ExpenseStatusMessages.Error.subcategory.notFound);
  }
}

export class CurrencyRequiredException extends BadRequestException {
  constructor() {
    super(ExpenseStatusMessages.Error.currency.required);
  }
}

export class CurrencyNotFoundException extends BadRequestException {
  constructor() {
    super(ExpenseStatusMessages.Error.currency.notFound);
  }
}
