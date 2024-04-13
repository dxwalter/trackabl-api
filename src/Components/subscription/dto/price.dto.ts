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
} from "class-validator";

export class CreatePricePlanDTO {
  @IsString()
  @IsNotEmpty({
    message: "Enter plan name",
  })
  public name: string;

  @IsBoolean()
  @IsNotEmpty({
    message: "Plan activation status",
  })
  public status: boolean;
}
