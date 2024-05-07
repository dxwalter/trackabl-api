import { GlobalRequestResponse } from "../../globals/global.types";

export interface defaultApiResponse extends GlobalRequestResponse {
  data?: any;
}

export interface GenerateTransactionResponse extends GlobalRequestResponse {
  data: {
    url: string;
  };
}
