import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateDepositAddressDTO } from "./dto/create-deposit-address.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import {
  SystemTokensResponse,
  GenerateDepositAddressResponse,
} from "./types/transactions.types";
import { GlobalRequestResponse } from "../globals/global.types";
import { AuthGuard } from "../user/guard/auth.guard";
import { TransactionResponseMessages } from "./config/transactions-message";
import { Utils } from "../utils";
import { CreateDepositAddress } from "./classes/TransactionCreateDepositAddress";
import { GlobalErrorService } from "../globals/global.error.service";

@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService
  ) {}

  @UseGuards(AuthGuard)
  @Post("/generate-wallet-address")
  async createTemporalWalletAddress(
    @Request() req: any,
    @Body() createDepositAddress: CreateDepositAddressDTO
  ): Promise<GenerateDepositAddressResponse> {
    return await new CreateDepositAddress(
      this.utils,
      this.globalError,
      this.transactionsService
    ).generateAddress(req, createDepositAddress);
  }

  @UseGuards(AuthGuard)
  @Get("/available-tokens")
  async availableTokens(): Promise<SystemTokensResponse> {
    return {
      status: true,
      message: TransactionResponseMessages.default,
      data: await this.transactionsService.getAllSystemTokens(),
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.transactionsService.findToken(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionsService.remove(+id);
  }
}
