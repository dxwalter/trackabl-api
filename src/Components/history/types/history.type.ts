export interface TokenHistoryType {
  id?: number;
  systemTokenId: number;
  temporalRemittanceId?: number;
  userId: number;
  previousWalletId: number | null;
  transactionType: string;
  tokenName: string;
  amount: number;
  balance: number;
  previousTransactionData: any | null;
  createdAtInUnixTimestamp: number;
}
