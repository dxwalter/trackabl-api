import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  isString,
  IsString,
  IsStrongPassword,
  MinLength,
  IsDate,
} from "class-validator";

import { TrialCount } from "../../../Config/global.dto";
export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty({
    message: "Select a category",
  })
  public categoryId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Select a subcategory",
  })
  public subcategoryId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Select a currency",
  })
  public currencyId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Enter an amount for this expense",
  })
  public amount: number;

  @IsOptional()
  public receipt?: any;

  @IsDateString()
  @IsNotEmpty({
    message: "Enter a date this expense was made",
  })
  public expenseDate: string;

  @IsString()
  @IsOptional()
  public note: string;
}
