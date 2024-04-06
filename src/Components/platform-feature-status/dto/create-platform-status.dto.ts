import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class CreatePlatformFeatureStatusDto {
  @IsString()
  @IsNotEmpty()
  public feature: string;

  @IsBoolean()
  @IsNotEmpty()
  public status: boolean;
}
