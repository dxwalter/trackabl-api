import { IsNotEmpty, IsNumber, IsEmail } from "class-validator";

export class TrialCount {
  @IsNumber()
  @IsNotEmpty()
  public trial_count: number;
}
