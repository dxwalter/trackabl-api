/* eslint-disable @typescript-eslint/no-var-requires */
import { userProfile } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { UserService } from "../../user.service";
import { Utils } from "../../../utils";
import { EventEmitter2 } from "@nestjs/event-emitter";

import {
  createUserResponse,
  ReferralCodeUsedEmail,
  JoinedTrackablSendEmail,
  JoinedTrackablVerifyEmailSendEmail,
  ReferralCodeGenerated,
} from "../../types/user.types";

export class GenerateReferralCodeForUser {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    protected eventEmitter: EventEmitter2
  ) {}

  async generateCode(req: any): Promise<userProfile> {
    const userId = req.user.id;

    // Generate referral code
    const referralCode = this.utils.generateReferralCode();

    await this.userService.updateUserProfile(userId, {
      referralCode: referralCode[0],
    });

    // send email
    this.eventEmitter.emit("send.email.authentication", {
      emailBody: "text",
      recipientEmail: req.user.email,
      subject: `🎉🥳 Hurray! You been invited to join our partnership program`,
      recipientName: req.user.firstName + " " + req.user.lastName,
      emailType: "GenerateReferralCode",
      referralCode: referralCode[0],
    } as ReferralCodeGenerated);

    const getProfile = this.utils.plainSequelizeObject(
      await this.userService.getUserProfileUsingID(userId)
    );

    return {
      status: true,
      message: UserStatusMessages.UserActions.ok,
      data: {
        ...this.utils.deleteSensitiveDataFromUserObject(getProfile),
      },
    };
  }
}
