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

export class CreateUserDto extends TrialCount {
  @IsString()
  @IsNotEmpty({
    message: "Tell us your full names",
  })
  public fullname: string;

  @IsEmail()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsOptional()
  public referral_code: string;
}
