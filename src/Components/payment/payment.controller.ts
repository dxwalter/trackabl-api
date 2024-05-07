import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import {
  CreateWebhookDto,
  InitializeTransactionDTO,
} from "./dto/create-webhook.dto";
import { UpdateWebhookDto } from "./dto/update-webhook.dto";
import { SubscriptionService } from "../subscription/subscription.service";
import { UserService } from "../user/user.service";
import { GlobalErrorService } from "../globals/global.error.service";
import { Utils } from "../utils";
import { AuthGuard } from "../user/guard/auth.guard";
import {
  GenerateTransactionResponse,
  defaultApiResponse,
} from "./types/transactions.types";
import { PaystackWebhookPayload } from "../utils/types/api.types";
import { SubscriptionPricePlan } from "./classes/PaymentsTransactions";
import { APIs } from "../utils/apis";

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly subscriptionService: SubscriptionService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService,
    private readonly apis: APIs,
    private readonly userService: UserService
  ) {}

  @Post("/webhook/paystack")
  async confirmDeposit(
    @Body() payload: PaystackWebhookPayload
  ): Promise<defaultApiResponse> {
    // verify transaction hash
    // verify with reference
    if (payload.event.toLowerCase() === "charge.success") {
      return await new SubscriptionPricePlan(
        this.subscriptionService,
        this.utils,
        this.globalError,
        this.apis,
        this.userService
      ).inititateSubscriptionCreation(payload, "paystack");
    }

    return {
      status: true,
      message: "",
    };
  }

  @UseGuards(AuthGuard)
  @Get("/initalize-transaction")
  async intializeTransaction(
    @Query() query: InitializeTransactionDTO,
    @Request() req: any
  ): Promise<GenerateTransactionResponse> {
    return await new SubscriptionPricePlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.apis,
      this.userService
    ).initializeTransaction({
      driver: query.paymentGateway,
      marketPriceId: query.marketPriceId,
      userId: req.user.id,
      numberOfMonths: query.numberOfMonths,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    // return this.webhookService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    // return this.webhookService.update(+id, updateWebhookDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    // return this.webhookService.remove(+id);
  }
}
