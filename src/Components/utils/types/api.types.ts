export interface intiatePaystackTransaction {
  amount: number;
  email: string;
  metadata: string;
}

export interface InitiatePaystackTransactionResponse {
  status: true;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackPaymentResponseData {
  id: number;
  status: string;
  amount: number;
  reference: string;
  metadata: {
    plan: {
      userId: number;
      planId: number;
      marketPriceId: number;
      numberOfMonths: number;
    };
  };
}

export interface PaystackWebhookPayload {
  event: string;
  data: PaystackPaymentResponseData;
}

export interface verifyPaystackTransactionResponse {
  status: boolean;
  message: string;
  data: PaystackPaymentResponseData;
}
