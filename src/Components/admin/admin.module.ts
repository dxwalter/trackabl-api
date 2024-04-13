import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AdminService } from "./admin.service";
import { AdminModel } from "./model/admin.model";
import { AdminController } from "./admin.controller";
import { Utils } from "../utils";
import { UserService } from "../user/user.service";
import { UserModel } from "../user/models/user.model";
import { UserSignUpPoints } from "../user/models/user-sign-up-points.model";
import { GlobalErrorService } from "../globals/global.error.service";
import { SystemErrorLogs } from "../globals/model/error-logs.model";

@Module({
  controllers: [AdminController],
  providers: [AdminService, UserService, Utils, GlobalErrorService],
  exports: [UserService, Utils, GlobalErrorService],
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      AdminModel,
      SystemErrorLogs,
      UserSignUpPoints,
    ]),
  ],
})
export class AdminModule {}
