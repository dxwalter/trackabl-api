import { BadRequestException } from "@nestjs/common";
import { UserService } from "../../user.service";
import { GlobalErrorService } from "../../../globals/global.error.service";
import { generateEmailVerificationTokenResponse } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import AppConfig from "../../../../Config/app.config";
import { GenerateUserEmailVerificationTokenDTO } from "../../dto/verify-user-email.dto";
import { Utils } from "../../../utils";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthCreateUserAccount } from "./AuthCreateAccount";

export class AuthGenerateEmailVerificationToken extends AuthCreateUserAccount {
  constructor(
    protected readonly userService: UserService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService,
    protected eventEmitter: EventEmitter2
  ) {
    super(userService, utils, GlobalError, eventEmitter);
  }

  async generateEmailToken(
    generateEmailToken: GenerateUserEmailVerificationTokenDTO
  ): Promise<generateEmailVerificationTokenResponse> {
    this.GlobalError.RequestTrialLimit(generateEmailToken.trial_count);
    const userEmail = generateEmailToken.email.toLowerCase();

    // check if email exists
    const getEmail =
      await this.userService.getProfileUsingEmailAddress(userEmail);

    if (getEmail === null) {
      return {
        status: true,
        message: UserStatusMessages.EmailVerification.generateNewToken,
      };
    }

    if (getEmail.isEmailVerified && AppConfig().environment.env !== "test") {
      return {
        status: true,
        message: UserStatusMessages.EmailVerification.success,
      };
    }

    const randomStringForEmailVerification = this.utils.generateEmailToken();

    const updateUserProfile = await this.userService.updateUserProfile(
      getEmail.id,
      {
        isEmailVerified: false,
        emailVerificationCode: randomStringForEmailVerification.toString(),
        updatedAt: new Date(),
      }
    );

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    // send email

    this.sendEmailVerification({
      recipientEmail: userEmail,
      recipientName: getEmail.firstName,
      verificationCode: randomStringForEmailVerification.toString(),
    });

    return {
      status: true,
      message: UserStatusMessages.EmailVerification.generateNewToken,
      emailVerificationCode:
        process.env.NODE_ENV === "test"
          ? randomStringForEmailVerification
          : undefined,
    };
  }
}
