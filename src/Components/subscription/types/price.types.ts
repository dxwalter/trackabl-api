import { GlobalRequestResponse } from "../../globals/global.types";

export interface PricePlan {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface createSubscriptionPlan {
  name: string;
  status: boolean;
}

export interface createSubscriptionPlanResponse extends GlobalRequestResponse {
  data: PricePlan;
}

export interface deleteSubscrptionResponse extends GlobalRequestResponse {}
