/* eslint-disable @typescript-eslint/no-var-requires */
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
import { BadRequestException } from "@nestjs/common";
import { GlobalRequestResponse } from "../../../globals/global.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { UserService } from "../../user.service";
import { Update2FAStatus } from "../../dto/verify-user-email.dto";
import { Failed2FAVerificationException } from "../../exceptions/user.exception";
import { GlobalErrorService } from "../../../globals/global.error.service";

export class AuthUpdate2FAStatus {
  constructor(
    protected readonly userService: UserService,
    protected readonly globalError: GlobalErrorService
  ) {}

  async update(
    req: any,
    payload: Update2FAStatus
  ): Promise<GlobalRequestResponse> {
    this.globalError.RequestTrialLimit(payload.trial_count);
    const userId = req.user.id;

    const user = await this.userService.getUserProfileUsingID(userId);

    if (!user?.twoFactorSecret) {
      throw new BadRequestException();
    }

    const status = !user.is2FASet;

    let data = {};

    if (status === false) {
      (data["twoFactorSecret"] = null), (data["is2FASet"] = status);
    } else {
      data["is2FASet"] = status;
    }

    await this.userService.updateUserProfile(userId, data);

    return {
      status: true,
      message: UserStatusMessages.TwoFactorAuthentication.statusUpdate,
    };
  }
}
