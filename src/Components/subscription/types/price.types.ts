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
  paymentProcessor: string;
  currencySymbol: string;
  vat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Price {
  id: number;
  planId: number;
  marketId: number;
  freePlanPriceInDays: number;
  priceAMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: number;
  isActive: boolean;
  userId: number;
  planId: number;
  marketId: number;
  priceMarketId: number;
  reference?: string;
  startDateInUnix: number;
  endDateInUnix: number;
  paymentDetails?: any;
  paymentProviderDetails: any;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface createSubscriptionPlan {
  name: string;
  status: boolean;
}

export interface createUserSubscription {
  isActive: boolean;
  userId: number;
  planId: number;
  marketId: number;
  priceMarketId: number;
  reference?: string;
  startDateInUnix: number;
  endDateInUnix: number;
  startDate: Date;
  endDate: Date;
  paymentProviderDetails: any;
  paymentDetails?: any;
}
export interface createSubscriptionPlanResponse extends GlobalRequestResponse {
  data: Plan;
}

export interface deleteSubscrptionResponse extends GlobalRequestResponse {}

export interface getMarketsResponse extends GlobalRequestResponse {
  data: Market[];
}

export interface getAllMarketPriceResponse extends GlobalRequestResponse {
  data: Price[];
}

export interface getPlansResponse extends GlobalRequestResponse {
  data: Plan[];
}

export interface createPriceResponse extends GlobalRequestResponse {
  data: Price;
}

export interface deletePriceResponse extends GlobalRequestResponse {}

export interface activateFreePlanResponse extends GlobalRequestResponse {
  data: UserSubscription;
}

export interface userSubscriptionListResponse extends GlobalRequestResponse {
  data: UserSubscription[];
}
