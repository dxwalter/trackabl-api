export class CreateWebhookDto {
  address: string;
}

export class InitializeTransactionDTO {
  paymentGateway: string;
  marketPriceId: number;
  numberOfMonths: number;
}
