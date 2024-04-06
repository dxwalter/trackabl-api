/* eslint-disable @typescript-eslint/no-var-requires */
const speakeasy = require("speakeasy");
import { UserService } from "../../user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import {
  loginUserResponse,
  two2FALoginUserResponse,
} from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import {
  InvalidEmailException,
  FailedLoginAttempException,
  Failed2FAVerificationException,
} from "../../exceptions/user.exception";
import { LoginUserWith2FADTO } from "../../dto/login-user.dto";

export class AuthLoginUserWith2FA {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService
  ) {}

  async loginUserWith2FA(
    payload: LoginUserWith2FADTO
  ): Promise<loginUserResponse | two2FALoginUserResponse> {
    this.GlobalError.RequestTrialLimit(payload.trial_count);

    const userEmail = payload.email.toLowerCase();

    if (userEmail.includes("+")) {
      throw new InvalidEmailException();
    }

    // check if email exists
    const getEmail =
      await this.userService.getProfileUsingEmailAddress(userEmail);

    if (getEmail === null) {
      throw new FailedLoginAttempException();
    }

    const userData = this.utils.plainSequelizeObject(getEmail);

    const verified = speakeasy.totp.verify({
      secret: userData.twoFactorSecret,
      encoding: "base32",
      token: payload.token,
    });

    if (!verified) {
      throw new Failed2FAVerificationException();
    }

    const generateToken =
      await this.userService.generateJwtTokenForUser(userData);

    delete userData.password;
    delete userData.emailVerificationCode;
    delete userData.passwordRecoveryCode;
    delete userData.twoFactorSecret;
    delete userData.transactionPin;

    return {
      data: {
        ...userData,
        token: generateToken,
      },
      message: UserStatusMessages.Login.success,
      status: true,
    };
  }
}
