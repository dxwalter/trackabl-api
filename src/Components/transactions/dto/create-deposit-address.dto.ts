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
  isNumber,
} from "class-validator";

import { TrialCount } from "../../../Config/global.dto";

export class CreateDepositAddressDTO extends TrialCount {
  @IsNumber()
  @IsNotEmpty()
  public systemTokenId: number;
}
