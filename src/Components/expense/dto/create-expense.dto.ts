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
  @IsString()
  @IsNotEmpty({
    message: "Select a category",
  })
  public categoryId: string;

  @IsString()
  @IsNotEmpty({
    message: "Select a subcategory",
  })
  public subcategoryId: string;

  @IsString()
  @IsNotEmpty({
    message: "Select a currency",
  })
  public currencyId: string;

  @IsString()
  @IsNotEmpty({
    message: "Enter an amount for this expense",
  })
  public amount: string;

  @IsOptional()
  public receipt?: any;

  @IsString()
  @IsNotEmpty({
    message: "Enter a date this expense was made",
  })
  public expenseDate: string;

  @IsString()
  @IsOptional()
  public note: string;

  @IsString()
  @IsNotEmpty()
  public trial_count: string;
}

export class EditExpenseDto extends CreateExpenseDto {
  @IsBoolean()
  @IsNotEmpty()
  public isOldPhotoRemoved: boolean;
}
