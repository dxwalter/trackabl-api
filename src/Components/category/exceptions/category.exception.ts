import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { CategoryStatusMessages } from "../config/category-response-messages";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}
export class CategoryExists extends BadRequestException {
  constructor() {
    super(CategoryStatusMessages.Status.exists);
  }
}

export class ProvideUserId extends BadRequestException {
  constructor() {
    super(CategoryStatusMessages.Status.userIdUnavailable);
  }
}

export class CategoryDoesNotExist extends BadRequestException {
  constructor() {
    super(CategoryStatusMessages.Status.doesNotExists);
  }
}

export class SubcategoryExists extends BadRequestException {
  constructor() {
    super(CategoryStatusMessages.Subcategory.exists);
  }
}
