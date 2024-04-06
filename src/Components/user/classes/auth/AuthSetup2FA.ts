/* eslint-disable @typescript-eslint/no-var-requires */
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
import { generate2FAQrCode } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";

export class AuthSetup2FA {
  constructor() {}

  async generateQRCode(): Promise<generate2FAQrCode> {
    const generateToken = speakeasy.generateSecret();

    const dataImage = await QRCode.toDataURL(generateToken.otpauth_url);

    return {
      status: true,
      message: UserStatusMessages.TwoFactorAuthentication.generateQrCode,
      data: {
        qrCode: dataImage,
        secret: generateToken,
      },
    };
  }
}
