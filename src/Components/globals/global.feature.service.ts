import { Injectable } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
@Injectable()
export class GlobalFeatureService extends PlatformFeatureStatusService {
  public checkFeature(featureKey: string) {}
}
