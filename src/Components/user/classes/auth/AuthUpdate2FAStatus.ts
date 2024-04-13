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

    return {
      status: true,
      message: UserStatusMessages.TwoFactorAuthentication.statusUpdate,
    };
  }
}
