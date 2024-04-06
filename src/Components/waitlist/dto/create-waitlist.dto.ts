import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from "class-validator";

export class CreateWaitlistDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsOptional()
  public referral_code: string;

  @IsNumber()
  public trial_count: number;
}
