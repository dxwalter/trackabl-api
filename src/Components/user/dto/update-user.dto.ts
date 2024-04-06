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
  IsPhoneNumber,
} from "class-validator";

import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { TrialCount } from "../../../Config/global.dto";

export class UpdateUserDto extends TrialCount {
  @IsString()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsOptional()
  public lastName: string;

  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  public nationality: string;

  @IsPhoneNumber()
  @IsOptional()
  public phoneNumber: string;
}

export class UpdateUserPasswordDto extends TrialCount {
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  public newPassword: string;
}

export class CreateTransactionPin extends TrialCount {
  @IsNumber()
  @IsNotEmpty()
  public pin: number;
}

export class UpdateTransactionPin extends TrialCount {
  @IsNumber()
  @IsNotEmpty()
  public oldPin: number;
  public newPin: number;
}
