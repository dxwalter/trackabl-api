import { Module } from "@nestjs/common";
import { WaitlistService } from "./waitlist.service";
import { WaitlistController } from "./waitlist.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { WaitlistUser } from "./models/waitlist-user.model";
import { WaitlistUsersPoint } from "./models/waitlist-referral-point.model";
import { Utils } from "../utils";
@Module({
  controllers: [WaitlistController],
  providers: [WaitlistService, Utils],
  imports: [SequelizeModule.forFeature([WaitlistUser, WaitlistUsersPoint])],
  exports: [Utils],
})
export class WaitlistModule {}
