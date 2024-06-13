import { GlobalRequestResponse } from "../../globals/global.types";
import { Market, Price } from "../../subscription/types/price.types";
export interface entrypoint {
  id: number;
  heroBannerImage: string;
  mobileHeroBannerImage: string | null;
  benefitBannerImage: string;
  mobileBenefitBannerImage: string | null;
  marketId: number;
  market: Market;
  pricing: Price[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface getEntryPoint extends GlobalRequestResponse {
  data: entrypoint;
}

export interface createEntrypoint extends GlobalRequestResponse {}
