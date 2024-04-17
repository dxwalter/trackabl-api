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

export class AdminGetAllPrice {
  @IsNumber()
  @IsOptional()
  public marketId: number;
}

export interface StoreIPStackResponse {
  userId: number;
  details: JSON;
}
