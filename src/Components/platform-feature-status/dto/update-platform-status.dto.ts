import { PartialType } from "@nestjs/mapped-types";
import { CreatePlatformFeatureStatusDto } from "./create-platform-status.dto";

export class UpdatePlatformStatusDto extends PartialType(
  CreatePlatformFeatureStatusDto
) {}
