import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  IsStrongPassword,
  MinLength,
  IsDate,
  IsDecimal,
} from "class-validator";

import { TrialCount } from "../../../Config/global.dto";

export class CreateSubscriptionDto {}

export class ActivateFreeSubscriptionPlanDto extends TrialCount {
  @IsNumber()
  @IsNotEmpty({})
  public planId: number;

  @IsNumber()
  @IsNotEmpty({})
  public priceId: number;
}
