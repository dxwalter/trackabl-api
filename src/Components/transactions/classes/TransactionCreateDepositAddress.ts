/* eslint-disable @typescript-eslint/no-var-requires */
const speakeasy = require("speakeasy");
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import { TransactionsService } from "../transactions.service";
import {} from "../types/transactions.types";
import { GenerateDepositAddressResponse } from "../types/transactions.types";
import {
  DefaultUserException,
  TokenNotFound,
  FailedToCreateTempWallet,
} from "../exceptions/transaction.exception";
import { CreateDepositAddressDTO } from "../dto/create-deposit-address.dto";
import { TransactionResponseMessages } from "../config/transactions-message";

export class CreateDepositAddress {
  constructor(
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService,
    protected readonly transactionService: TransactionsService
  ) {}

  async generateAddress(
    req: any,
    payload: CreateDepositAddressDTO
  ): Promise<GenerateDepositAddressResponse> {
    this.GlobalError.RequestTrialLimit(payload.trial_count);
    await this.GlobalError.checkFeature("DEPOSIT");
    const userId = req.user.id;

    const getToken = await this.transactionService.findToken(
      payload.systemTokenId
    );

    if (getToken === null) {
      throw new TokenNotFound();
    }

    //call binance to create temporary address

    const temporaryAddress =
      "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" + Math.random().toString();

    // store temporary address
    const storeAddress = await this.transactionService.storeTemporaryAddress({
      binanceTemporalWalletID: temporaryAddress,
      systemTokenId: payload.systemTokenId,
      userId,
    });

    if (!storeAddress) {
      throw new FailedToCreateTempWallet();
    }

    return {
      status: true,
      message: TransactionResponseMessages.default,
      data: {
        address: temporaryAddress,
      },
    };
  }
}
