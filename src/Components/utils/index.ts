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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require("crypto");
const moesif = require("moesif-nodejs");
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
}
// isTransactionPinSet: userData.transactionPin === null ? false : true,
