import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GlobalErrorService } from "./global.error.service";
import { GlobalModuleController } from "./global.controller";
import { SystemErrorLogs } from "./model/error-logs.model";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";

@Module({
  controllers: [GlobalModuleController],
  providers: [GlobalErrorService],
  imports: [
    SequelizeModule.forFeature([SystemErrorLogs, PlatformFeatureStatus]),
  ],
})
export class GlobalModule {}
