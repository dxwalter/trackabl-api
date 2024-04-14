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

export class CreatePricePlan {
  @IsNumber()
  @IsNotEmpty({
    message: "Select plan",
  })
  public planId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Plan activation status",
  })
  public marketId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Provide how long will there be free plan for this plan in days",
  })
  public freePlanPriceInDays: number;

  @IsDecimal()
  @IsNotEmpty({
    message: "How much is this plan",
  })
  public priceAMonth: number;
}
