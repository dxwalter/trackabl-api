import { UserService } from "../../user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import {
  loginUserResponse,
  two2FALoginUserResponse,
} from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { FailedLoginAttempException } from "../../exceptions/user.exception";
import { LoginUserDTO } from "../../dto/login-user.dto";

export class AuthLoginUser {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService
  ) {}

  async loginUser(
    payload: LoginUserDTO
  ): Promise<loginUserResponse | two2FALoginUserResponse> {
    this.GlobalError.checkFeature("LOGIN");
    this.GlobalError.RequestTrialLimit(payload.trial_count);
    const userEmail = payload.email.toLowerCase();

    this.utils.validateEmail(userEmail);

    // check if email exists
    const getEmail =
      await this.userService.getProfileUsingEmailAddress(userEmail);

    if (getEmail === null) {
      throw new FailedLoginAttempException();
    }

    const userData = this.utils.plainSequelizeObject(getEmail);

    // compare password
    const checkPassword = this.utils.decryptPassword(
      payload.password,
      userData.password
    );

    if (checkPassword === false) {
      throw new FailedLoginAttempException();
    }

    if (userData.is2FASet) {
      return {
        message: UserStatusMessages.Login.twoFactorAuthentication,
        status: true,
        data: {
          is2FASet: true,
        },
      };
    }

    const generateToken =
      await this.userService.generateJwtTokenForUser(userData);

    return {
      data: {
        ...this.utils.deleteSensitiveDataFromUserObject(userData),
        token: generateToken,
      },
      message: UserStatusMessages.Login.success,
      status: true,
    };
  }
}
