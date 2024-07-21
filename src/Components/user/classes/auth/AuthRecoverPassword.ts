import { BadRequestException } from "@nestjs/common";
import { UserService } from "../../user.service";
import { GlobalErrorService } from "../../../globals/global.error.service";
import {
  generateEmailVerificationTokenResponse,
  RecoverPasswordSendEmail,
} from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { RecoverPasswordValidator } from "../../dto/verify-user-email.dto";
import { Utils } from "../../../utils";
import { EventEmitter2 } from "@nestjs/event-emitter";

export class AuthRecoverUserPassword {
  constructor(
    protected readonly userService: UserService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService,
    protected eventEmitter: EventEmitter2
  ) {}

  async sendRecoveryTokenAsEmail(
    userData: RecoverPasswordValidator
  ): Promise<generateEmailVerificationTokenResponse> {
    this.GlobalError.RequestTrialLimit(userData.trial_count);

    const userEmail = userData.email.toLowerCase();

    // check if email exists
    const getEmail =
      await this.userService.getProfileUsingEmailAddress(userEmail);

    if (getEmail === null) {
      return {
        status: true,
        message: UserStatusMessages.EmailVerification.recoverEmailValidation,
      };
    }

    const randomStringForEmailVerification = this.utils.generateEmailToken();

    const updateUserProfile = await this.userService.updateUserProfile(
      getEmail.id,
      {
        passwordRecoveryCode: randomStringForEmailVerification,
        updatedAt: new Date(),
      }
    );

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    // send email

    this.eventEmitter.emit("send.email.authentication", {
      emailBody: "text",
      recipientEmail: userEmail,
      subject: `Reset your Trackabl password!`,
      recipientName: getEmail.firstName,
      emailType: "RecoverUserPassword",
      recoveryCode: randomStringForEmailVerification,
      redirectPath: userData.redirect_url,
    } as RecoverPasswordSendEmail);

    return {
      status: true,
      message: UserStatusMessages.EmailVerification.recoverEmailValidation,
      passwordResetCode:
        process.env.NODE_ENV === "test"
          ? randomStringForEmailVerification
          : undefined,
    };
  }
}
