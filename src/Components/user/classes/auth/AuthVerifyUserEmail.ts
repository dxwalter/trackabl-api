import { BadRequestException } from "@nestjs/common";
import { UserService } from "../../user.service";
import { GlobalErrorService } from "../../../globals/global.error.service";
import { defaultResponse } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { InvalidEmailVerificationTokenException } from "../../exceptions/user.exception";

import { VerifyUserEmailDTO } from "../../dto/verify-user-email.dto";

export class AuthVerifyUserEmail {
  constructor(
    private readonly userService: UserService,
    private readonly GlobalError: GlobalErrorService
  ) {}

  async verifyUserEmail(
    id: string,
    verifyUserEmailData: VerifyUserEmailDTO
  ): Promise<defaultResponse> {
    this.GlobalError.RequestTrialLimit(verifyUserEmailData.trial_count);

    const token = id;

    const confirmToken = await this.userService.getUserProfileWithToken(token);

    if (confirmToken === null) {
      throw new InvalidEmailVerificationTokenException();
    }

    if (confirmToken.isEmailVerified) {
      return {
        status: true,
        message: UserStatusMessages.EmailVerification.success,
      };
    }

    const updateUserProfile = await this.userService.updateUserProfile(
      confirmToken.id,
      {
        isEmailVerified: true,
        updatedAt: new Date(),
      }
    );

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    return {
      status: true,
      message: UserStatusMessages.EmailVerification.success,
    };
  }
}
