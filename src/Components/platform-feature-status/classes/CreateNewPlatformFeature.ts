import { PlatformFeatureStatusService } from "../platform-status.service";
import { CreatePlatformFeatureStatusDto } from "../dto/create-platform-status.dto";
import {
  FeatureExists,
  FeatureDoesNotExists,
} from "../exceptions/platform.feature.status.exception";
import { PlatformFeaturetatusMessages } from "../config/platform-status-response-message";
import { GlobalRequestResponse } from "../../globals/global.types";
import { platformFeatureResponse } from "../types/platformFeature.types";
import { Utils } from "../../utils/index";

export class CreatePlaformFeature {
  constructor(
    private readonly platformFeatureService: PlatformFeatureStatusService,
    private readonly utils: Utils
  ) {}

  async createFeature(
    data: CreatePlatformFeatureStatusDto
  ): Promise<platformFeatureResponse> {
    const feature = data.feature.toUpperCase();

    const getFeature = await this.platformFeatureService.findOne(feature);

    if (getFeature) {
      throw new FeatureExists();
    }

    return {
      status: true,
      message: PlatformFeaturetatusMessages.create.success,
      data: await this.platformFeatureService.create({
        feature,
        status: data.status,
      }),
    };
  }

  async deleteFeature(id: number): Promise<GlobalRequestResponse> {
    await this.platformFeatureService.remove(id);
    return {
      status: true,
      message: PlatformFeaturetatusMessages.delete.success,
    };
  }

  async updateStatus(id: number): Promise<platformFeatureResponse> {
    const getFeature = await this.platformFeatureService.findOneWithId(id);

    if (!getFeature) {
      throw new FeatureDoesNotExists();
    }

    const format = this.utils.plainSequelizeObject(getFeature);

    format.status = !format.status;

    await this.platformFeatureService.update(id, {
      status: format.status,
    });

    return {
      status: true,
      message: PlatformFeaturetatusMessages.update.success,
      data: format,
    };
  }
}
