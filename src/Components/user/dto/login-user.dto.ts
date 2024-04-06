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

export class LoginUserDTO extends TrialCount {
  @IsEmail()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class LoginUserWith2FADTO extends TrialCount {
  @IsEmail()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public email: string;

  @IsNumber()
  @IsNotEmpty()
  public token: number;
}
