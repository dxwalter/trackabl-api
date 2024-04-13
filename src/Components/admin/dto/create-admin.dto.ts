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

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty({
    message: "Enter fullname",
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
  public accessLevel: string;
}
