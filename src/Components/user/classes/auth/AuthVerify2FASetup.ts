/* eslint-disable @typescript-eslint/no-var-requires */
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
import { GlobalRequestResponse } from "../../../globals/global.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { UserService } from "../../user.service";
import { Verify2FASetup } from "../../dto/verify-user-email.dto";
import { Failed2FAVerificationException } from "../../exceptions/user.exception";
import { GlobalErrorService } from "../../../globals/global.error.service";

export class AuthVerify2FASetup {
  constructor(
    protected readonly userService: UserService,
    protected readonly globalError: GlobalErrorService
  ) {}

  async validate(
    req: any,
    verificationData: Verify2FASetup
  ): Promise<GlobalRequestResponse> {
    this.globalError.RequestTrialLimit(verificationData.trial_count);
    const userId = req.user.id;

    const verified = speakeasy.totp.verify({
      secret: verificationData.base32,
      encoding: "base32",
      token: verificationData.token,
    });

    if (!verified) {
      throw new Failed2FAVerificationException();
    }

    await this.userService.updateUserProfile(userId, {
      is2FASet: true,
      twoFactorSecret: verificationData.base32,
    });

    return {
      status: true,
      message: UserStatusMessages.TwoFactorAuthentication.verification,
    };
  }
}
