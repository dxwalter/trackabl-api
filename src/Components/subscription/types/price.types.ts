import { GlobalRequestResponse } from "../../globals/global.types";

export interface Plan {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Market {
  id: number;
  countryName: string;
  countryCode: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface createSubscriptionPlan {
  name: string;
  status: boolean;
}

export interface createSubscriptionPlanResponse extends GlobalRequestResponse {
  data: Plan;
}

export interface deleteSubscrptionResponse extends GlobalRequestResponse {}

export interface getMarketsResponse extends GlobalRequestResponse {
  data: Market[];
}

export interface getPlansResponse extends GlobalRequestResponse {
  data: Plan[];
}
