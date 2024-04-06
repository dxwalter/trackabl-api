import {
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsString,
  MinLength,
} from "class-validator";
import { TrialCount } from "../../../Config/global.dto";

export class VerifyUserEmailDTO extends TrialCount {}

export class GenerateUserEmailVerificationTokenDTO extends TrialCount {
  @IsEmail()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public email: string;
}

export class RecoverPasswordValidator extends TrialCount {
  @IsEmail()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public email: string;

  @IsString()
  @IsNotEmpty({
    message: "Enter a valid return URL",
  })
  public redirect_url: string;
}

export class ChangeUnauthenticatedUserPassword extends TrialCount {
  @IsEmail()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public email: string;

  @IsString()
  @IsNotEmpty({
    message: "Enter a valid return URL",
  })
  public token: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class Verify2FASetup extends TrialCount {
  @IsString()
  @IsNotEmpty({
    message: "Enter a valid email address",
  })
  public base32: string;

  @IsString()
  @IsNotEmpty({
    message: "Enter a valid return URL",
  })
  public token: string;
}

export class Update2FAStatus extends TrialCount {}
