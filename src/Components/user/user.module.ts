import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthenticationController } from "./auth.controller";
import { UserModel } from "./models/user.model";
import { UserSignUpPoints } from "./models/user-sign-up-points.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { Utils } from "../utils";
import { JwtService } from "@nestjs/jwt";
import { GlobalErrorService } from "../globals/global.error.service";
import appConfig from "../../Config/app.config";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";
import { SystemErrorLogs } from "../globals/model/error-logs.model";
import { GlobalLogService } from "../globals/global.log.service";
@Module({
  controllers: [UserController, AuthenticationController],
  providers: [
    UserService,
    Utils,
    JwtService,
    GlobalErrorService,
    PlatformFeatureStatusService,
    GlobalLogService,
  ],
  exports: [
    Utils,
    JwtService,
    GlobalErrorService,
    PlatformFeatureStatusService,
    GlobalLogService,
  ],
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      UserSignUpPoints,
      PlatformFeatureStatus,
      SystemErrorLogs,
    ]),
    JwtModule.register({
      global: true,
      secret: appConfig().security.jwtConstant,
      signOptions: { expiresIn: "30d" },
    }),
  ],
})
export class UserModule {}
