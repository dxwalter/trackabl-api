import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PlatformFeaturetatusMessages } from "../config/platform-status-response-message";

export class DefaultUserException extends BadRequestException {
  constructor() {
    super(`An error occurred completing your request. Please try again`);
  }
}

export class FeatureExists extends BadRequestException {
  constructor() {
    super(PlatformFeaturetatusMessages.create.featureExists);
  }
}

export class FeatureDoesNotExists extends BadRequestException {
  constructor() {
    super(PlatformFeaturetatusMessages.create.featureDoesNotExist);
  }
}
