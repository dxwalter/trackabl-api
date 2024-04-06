/* eslint-disable @typescript-eslint/no-var-requires */
const speakeasy = require("speakeasy");
import { Utils } from "../../utils";
import { GlobalErrorService } from "../../globals/global.error.service";
import { TransactionsService } from "../transactions.service";
import {} from "../types/transactions.types";
import {
  GenerateDepositAddressResponse,
  TemporaryDepositDetails,
  GenerateDepositConfirmationResponse,
} from "../types/transactions.types";
import {
  DefaultUserException,
  TokenNotFound,
  FailedToUpdateTemporaryDeposit,
} from "../exceptions/transaction.exception";
import { CreateDepositAddressDTO } from "../dto/create-deposit-address.dto";
import { TransactionResponseMessages } from "../config/transactions-message";
import { HistoryService } from "../../history/history.service";

export class ConfrimDeposit {
  constructor(
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService,
    protected readonly transactionService: TransactionsService,
    private historyService: HistoryService
  ) {}

  async verifyDeposit(
    address: string
  ): Promise<GenerateDepositConfirmationResponse> {
    const amount = 2;

    const getTemporaryTransaction =
      await this.transactionService.getTemporaryTransactionByAddress(address);

    if (!getTemporaryTransaction) {
      // Log failed request
      throw new Error();
    }

    // get token type

    const systemToken = await this.transactionService.findToken(
      getTemporaryTransaction.systemTokenId
    );

    if (!systemToken) {
      // Log failed request
      throw new Error();
    }

    const updateTempTransaction =
      await this.transactionService.updateTemporalTransactionusingId(
        getTemporaryTransaction.id,
        {
          amount,
          recipientStatus: true,
          baseDeploymentStatus: true,
          updatedAt: new Date(),
        }
      );

    if (updateTempTransaction[0] === 0) {
      // log user response
      throw new FailedToUpdateTemporaryDeposit();
    }

    // move token from subacount to main account

    const getLatestHistoryEntryPerUserAndToken =
      await this.historyService.getLastHistoryEntryForUserPerToken(
        getTemporaryTransaction.userId,
        getTemporaryTransaction.systemTokenId
      );

    console.log(getLatestHistoryEntryPerUserAndToken);

    // create new Entry for history per user and per token

    const developNewHistoryData = this.utils.computeDataForTokenDeposit(
      getLatestHistoryEntryPerUserAndToken,
      amount,
      systemToken,
      getTemporaryTransaction
    );

    return {
      data: await this.historyService.createHistoryEntry(developNewHistoryData),
      message: TransactionResponseMessages.webhook.confirmDeposit,
      status: true,
    };
  }
}
