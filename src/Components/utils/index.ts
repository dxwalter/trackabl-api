import { BadRequestException } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReferralCodes = require("voucher-code-generator");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomstring = require("randomstring");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const domainList = require("disposable-email-domains");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dns = require("node:dns");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require("crypto");
const moesif = require("moesif-nodejs");

import { EventEmitter2 } from "@nestjs/event-emitter";

import AppConfigs from "../../Config/app.config";

import { InvalidEmailException } from "../../Components/user/exceptions/user.exception";

import appConfig from "../../Config/app.config";
import { TokenWalletHistory } from "../history/models/token-wallet-history";
import {
  SystemToken,
  TemporaryDepositDetails,
} from "../transactions/types/transactions.types";
import { TokenHistoryType } from "../history/types/history.type";
import { TRANSACTION_TYPE } from "../history/types/history.constant";

import { SystemErrorLogDTO } from "../globals/types/globel.types";

cloudinary.config({
  secure: true,
  cloud_name: AppConfigs().cloudinary.cloudName,
  api_key: AppConfigs().cloudinary.apiKey,
  api_secret: AppConfigs().cloudinary.apiSecret,
});

export class Utils {
  public generateReferralCode = () => {
    return ReferralCodes.generate({
      length: 6,
      count: 1,
    });
  };

  public isEmailDisposable = (domain: string): boolean => {
    if (process.env.NODE_ENV !== "production") return false; // only do this on production
    return domainList.includes(domain);
  };

  public checkDomainExistence = async (domain: string) => {
    return new Promise((resolve) => {
      dns.resolve4(domain, (err) => {
        if (err) {
          return resolve(false);
        }

        return resolve(true);
      });
    });
  };

  public getEncryptionSaltRounds = () => {
    return bcrypt.genSaltSync(appConfig().security.saltRounds);
  };

  public encryptPassword = (password: string): string => {
    return bcrypt.hashSync(password, appConfig().security.saltRounds);
  };

  public decryptPassword = (rawInput: string, hash: string): boolean => {
    return bcrypt.compareSync(rawInput, hash);
  };

  public validatePassword = (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compareSync(password, hashedPassword);
  };

  public generateRandomString = (length: number): string => {
    return randomstring.generate(length);
  };

  public encryptSHA1 = (value: string): string => {
    return crypto.createHash("sha1").update(value).digest("hex");
  };

  public generateEmailToken = (): string => {
    return this.encryptSHA1(this.generateRandomString(10));
  };

  public generateTokenWithRance = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  public plainSequelizeObject = (data: any) => {
    return data.get({ plain: true });
  };

  public logUserActions = (
    userId: any,
    context: string,
    userData: any,
    errorMessage: any = undefined,
    errorStack: any = {}
  ) => {
    if (appConfig().environment.env === "test") return;

    // This is an example script - don't forget to change it!
  };

  public validateEmail = (email: string) => {
    const modifyEmail = email.toLowerCase();
    if (modifyEmail.includes("+")) {
      throw new InvalidEmailException();
    }

    const emailDomain = modifyEmail.split("@")[1];

    if (this.isEmailDisposable(emailDomain)) {
      throw new InvalidEmailException();
    }
  };

  public deleteSensitiveDataFromUserObject = (userData: any) => {
    userData["twoFactorSecret"] = undefined;
    userData["passwordRecoveryCode"] = undefined;
    userData["transactionPin"] = undefined;

    userData["twoFactorSecret"] = undefined;
    userData["transactionPin"] = undefined;
    userData["passwordRecoveryCode"] = undefined;
    userData["password"] = undefined;
    userData["emailVerificationCode"] = undefined;
    delete userData.emailVerificationCode;

    return userData;
  };

  public computeDataForTokenDeposit = (
    previousTransactionData: TokenHistoryType | null,
    depositAmount: number,
    systemToken: SystemToken,
    temporaryDepositData: TemporaryDepositDetails
  ): TokenHistoryType => {
    const currentBalance = previousTransactionData
      ? previousTransactionData.amount
      : 0;
    const previousTransactionId = previousTransactionData?.id
      ? previousTransactionData.id
      : null;

    return {
      amount: Number(depositAmount), // amount deposited
      balance: currentBalance + depositAmount,
      createdAtInUnixTimestamp: Date.now(),
      previousTransactionData: previousTransactionData,
      previousWalletId: previousTransactionId,
      systemTokenId: systemToken.systemTokenId,
      temporalRemittanceId: temporaryDepositData.id,
      tokenName: systemToken.name,
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      userId: temporaryDepositData.userId,
    };
  };

  public SetupLogService = () => {
    return moesif({
      applicationId: AppConfigs().logging.authKey,

      // Optional hook to link API calls to users
      identifyUser: function (req, res) {
        return req.user ? req.user.id : undefined;
      },
    });
  };

  public uploadImageToCloudinary = async (data: {
    imagePath: string;
    asset_folder: string;
  }): Promise<string> => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: false,
      unique_filename: true,
      overwrite: false,
      asset_folder: data.asset_folder,
    };

    try {
      // Upload the image
      if (AppConfigs().environment.env?.toLowerCase() === "test") {
        return "https://res.cloudinary.com/dsvppsml4/image/upload/v1714318977/trackabl.io/category_icons/category_icon_jnj7uz.svg";
      }
      const result = await cloudinary.uploader.upload(data.imagePath, {
        ...options,
      });
      return result.secure_url;
    } catch (error) {
      Error.captureStackTrace(error);
      const eventEmitter = new EventEmitter2();

      eventEmitter.emit("log.system.error", {
        message: `Error uploading image to cloudinary`,
        severity: "HIGH",
        details: {
          service: "Utils.uploadImageToCloudinary",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred uploading file to cloudinary"
      );
    }
  };

  public capitalizeWord = (word: string): string => {
    const tolowerCase = word.toLowerCase();
    return tolowerCase.charAt(0).toUpperCase() + tolowerCase.slice(1);
  };

  public generateRandomColor = () => {
    const red = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const green = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const blue = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    return `#${red}${green}${blue}`;
  };
}
