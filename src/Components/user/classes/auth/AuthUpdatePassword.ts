import { BadRequestException } from "@nestjs/common";
import { UserService } from "../../user.service";
import { GlobalErrorService } from "../../../globals/global.error.service";
import { UserStatusMessages } from "../../config/user-response-message";
import { ChangeUnauthenticatedUserPassword } from "../../dto/verify-user-email.dto";
import { GlobalRequestResponse } from "../../../globals/global.types";
import { InvalidEmailVerificationTokenException } from "../../exceptions/user.exception";
export class AuthUpdateUserPassword {
  constructor(
    protected readonly userService: UserService,
    protected readonly globalError: GlobalErrorService
  ) {}

  async changeUserPassword(
    userData: ChangeUnauthenticatedUserPassword
  ): Promise<GlobalRequestResponse> {
    this.globalError.RequestTrialLimit(userData.trial_count);

    const userEmail = userData.email.toLowerCase();

    const recoveryToken = userData.token;

    const User = await this.userService.getProfileUsingEmailAddress(userEmail);

    if (User === null) {
      return {
        status: true,
        message: UserStatusMessages.UserActions.passwordUpdate,
      };
    }

    if (User.passwordRecoveryCode !== recoveryToken) {
      throw new InvalidEmailVerificationTokenException();
    }

    // create password
    const newPassword = await this.userService.generatePasswordForUser(
      userData.password
    );

    const updateUserProfile = await this.userService.updateUserProfile(
      User.id,
      {
        password: newPassword,
        updatedAt: new Date(),
      }
    );

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    return {
      status: true,
      message: UserStatusMessages.UserActions.passwordUpdate,
    };
  }
}
