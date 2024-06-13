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

import { TrialCount } from "../../../Config/global.dto";
export class CreateEntrypointDto {
  @IsString()
  @IsNotEmpty({
    message: "Kindly provide a hero banner url",
  })
  public heroBannerUrl: string;

  @IsString()
  @IsOptional()
  public mobileHeroBannerImage: string;

  @IsString()
  @IsNotEmpty({
    message: "Kindly provide a benefit banner url",
  })
  public benefitBannerUrl: string;

  @IsString()
  @IsOptional()
  public mobileBenefitBanner: string;

  @IsNumber()
  public marketId: number;
}
