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

export class CreateCategoryDto extends TrialCount {
  @IsString()
  @IsNotEmpty({
    message: "Enter category name",
  })
  public name: string;

  @IsBoolean()
  @IsNotEmpty({
    message: "Was this a user defined category?",
  })
  public isUserDefinedCategory: boolean;

  @IsBoolean()
  @IsNotEmpty({
    message: "Set category to active",
  })
  public setActive: boolean;

  @IsNotEmpty({
    message: "Select an icon to be uploaded",
  })
  public icon: any;

  @IsString()
  @IsNotEmpty({
    message: "Enter category color in HEX code",
  })
  public color: string;

  @IsNumber()
  @IsOptional()
  public userId: number;
}

export class CreateSubcategoryDto extends TrialCount {
  @IsString()
  @IsNotEmpty({
    message: "Enter category name",
  })
  public name: string;

  @IsBoolean()
  @IsNotEmpty({
    message: "Was this a user defined category?",
  })
  public isUserDefinedSubcategory: boolean;

  @IsBoolean()
  @IsNotEmpty({
    message: "Set category to active",
  })
  public isSubcategoryActive: boolean;

  @IsString()
  @IsNotEmpty({
    message: "Enter category color in HEX code",
  })
  public color: string;

  @IsNumber()
  @IsOptional()
  public userId: number;
}

export class CreateUserSuggestedCategoryDto extends TrialCount {
  @IsString()
  @IsNotEmpty({
    message: "Enter category name",
  })
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;
}

export class CreateUserSuggestedSubCategoryDto extends TrialCount {
  @IsString()
  @IsNotEmpty({
    message: "Enter category name",
  })
  public name: string;

  @IsString()
  @IsNotEmpty({
    message: "Was this a user defined category?",
  })
  public description: string;

  @IsNumber()
  @IsNotEmpty({
    message: "Select a category",
  })
  public categoryId: number;

  @IsBoolean()
  @IsOptional()
  public isPublic: string;
}
