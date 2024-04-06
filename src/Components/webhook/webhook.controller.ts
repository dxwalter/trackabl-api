import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { CreateWebhookDto } from "./dto/create-webhook.dto";
import { UpdateWebhookDto } from "./dto/update-webhook.dto";
import { TransactionsService } from "../transactions/transactions.service";
import { HistoryService } from "../history/history.service";
import { GlobalErrorService } from "../globals/global.error.service";
import { Utils } from "../utils";

import { ConfrimDeposit } from "../transactions/classes/TransactionConfirmDeposit";

@Controller("webhook")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly transactionsService: TransactionsService,
    private readonly historyService: HistoryService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService
  ) {}

  @Post("confirm-deposit")
  async confirmDeposit(@Body() createWebhookDto: CreateWebhookDto) {
    // verify that request is from binance and verify the transaction on binance
    return await new ConfrimDeposit(
      this.utils,
      this.globalError,
      this.transactionsService,
      this.historyService
    ).verifyDeposit(createWebhookDto.address);
  }

  @Get()
  findAll() {
    return this.webhookService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.webhookService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhookService.update(+id, updateWebhookDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.webhookService.remove(+id);
  }
}
