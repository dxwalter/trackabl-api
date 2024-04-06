import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlatformFeatureStatusService } from "./platform-status.service";
import { PlatformFeatureStatusController } from "./platform-status.controller";
import { PlatformFeatureStatus } from "./models/platform-feature-status.model";
import { Utils } from "../utils/index";

@Module({
  controllers: [PlatformFeatureStatusController],
  providers: [PlatformFeatureStatusService, Utils],
  imports: [SequelizeModule.forFeature([PlatformFeatureStatus])],
})
export class PlatformFeatureStatusModule {}
