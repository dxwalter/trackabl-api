import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BadRequestException } from "@nestjs/common";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";
import { PlatformFeaturetatusMessages } from "../platform-feature-status/config/platform-status-response-message";
import { SystemErrorLogs } from "./model/error-logs.model";

@Injectable()
export class GlobalErrorService extends PlatformFeatureStatusService {
  constructor(
    @InjectModel(SystemErrorLogs)
    private readonly systemErrorLog: typeof SystemErrorLogs
  ) {
    super(PlatformFeatureStatus);
  }

  public RequestTrialLimit(
    userTrialCount: number,
    systemLimitCount: number = 4
  ) {
    if (userTrialCount >= systemLimitCount) {
      throw new BadRequestException("Request limit exceeded by user", {
        cause: `User tried this request more than ${systemLimitCount} time(s)`,
        description: "Request limit exceeded by user",
      });
    }
  }

  async checkFeature(featureKey: string) {
    if (featureKey.length === 0) {
      throw new BadRequestException(
        PlatformFeaturetatusMessages.featureStatus.unknown
      );
    }

    const getFeature = await this.findOne(featureKey);

    if (getFeature?.status === false) {
      throw new BadRequestException(
        PlatformFeaturetatusMessages.featureStatus.unavailable
      );
    }
  }
}
