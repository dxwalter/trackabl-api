import { GlobalRequestResponse } from "../../globals/global.types";
import { SendEmail } from "../../notification/config/notification.types";
import { TokenHistoryType } from "../../history/types/history.type";

export interface SystemToken {
  systemTokenId: number;
  name: string;
  icon: string;
  minimumDepositAmount: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface TemporaryDepositDetails {
  id: number;
  userId: number;
  systemTokenId: number;
  historyId: number | null;
  binanceTemporalWalletID: string;
  amount: number;
  recipientStatus: boolean;
  baseDeploymentStatus: boolean;
}

export interface SystemTokensResponse extends GlobalRequestResponse {
  data: SystemToken[];
}

export interface GenerateDepositAddressResponse extends GlobalRequestResponse {
  data: {
    address: string;
  };
}

export interface GenerateDepositConfirmationResponse
  extends GlobalRequestResponse {
  data: TokenHistoryType;
}

export interface TemporaryAddressInterface {
  userId: number;
  systemTokenId: number;
  binanceTemporalWalletID: string;
  amount?: number;
}

export interface UpdateTemporaryAddressInterface {
  userId?: number;
  systemTokenId?: number;
  amount?: number;
  historyId?: number;
  recipientStatus?: boolean;
  baseDeploymentStatus?: boolean;
  updatedAt?: Date;
}
