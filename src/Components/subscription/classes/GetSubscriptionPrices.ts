import { Injectable, BadRequestException } from "@nestjs/common";
import { SubscriptionService } from "../subscription.service";
import { Utils } from "../../utils";
import { APIs } from "../../utils/apis";
import { GlobalErrorService } from "../../globals/global.error.service";
import { getAllMarketPriceResponse } from "../types/price.types";
import { IpStackType } from "../types/ipStack.types";
import Config from "../../../Config/app.config";
import { SubcriptionPlanStatusMessage } from "../config/subscription-response-message";
import { MarketModel } from "../model/market.model";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../../globals/types/globel.types";

export class GetSubscriptionPlanPrices {
  constructor(
    protected readonly subscriptionService: SubscriptionService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService,
    protected readonly api: APIs,
    protected eventEmitter: EventEmitter2
  ) {}

  findUserMarket(
    markets: MarketModel[],
    ipStackDataFromDB: IpStackType | null,
    ipStackDataFromAPI: IpStackType | null
  ) {
    if (ipStackDataFromDB) {
      return markets.filter(
        (market) =>
          market.countryCode.toLowerCase() ===
          ipStackDataFromDB?.country_code.toLowerCase()
      );
    }

    if (ipStackDataFromAPI) {
      return markets.filter((market) => {
        return (
          market.countryCode.toLowerCase() ===
          ipStackDataFromAPI?.country_code.toLowerCase()
        );
      });
    }

    return [];
  }

  async getPlans(req: any): Promise<getAllMarketPriceResponse> {
    try {
      const userId = req.user.id;
      // get all markets
      const allMarkets = await this.subscriptionService.getAllMarkets();

      let ipStackData: IpStackType | null = null;

      const getIpStackDataFromDB =
        await this.subscriptionService.getIpStackRecordUsingUserId(userId);

      if (getIpStackDataFromDB === null) {
        const ipStackUrl = `http://api.ipstack.com/check?access_key=${
          Config().ipStack.key
        }`;

        const makeRequest = await this.api.makeAPIGetRequest(ipStackUrl);

        console.log(makeRequest);

        ipStackData = makeRequest;
        await this.subscriptionService.storeIpStackResponse({
          userId,
          details: makeRequest,
        });
      }

      const UsMarket = allMarkets.filter(
        (market) => market.countryCode.toLowerCase() === "usa"
      );

      const userMarket = this.findUserMarket(
        allMarkets,
        getIpStackDataFromDB?.details as IpStackType,
        ipStackData
      );

      const responseMessage = {
        status: true,
        message: SubcriptionPlanStatusMessage.default,
      };

      if (userMarket.length > 0) {
        const marketId = userMarket[0].id;
        return {
          ...responseMessage,
          data: await this.subscriptionService.getAllPrice(marketId),
        };
      }

      const usMarketId = UsMarket[0].id;

      return {
        ...responseMessage,
        data: await this.subscriptionService.getAllPrice(usMarketId),
      };
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error occurred getting plans for users - ${error.message}`,
        severity: "MEDIUM",
        details: {
          service: "GetSubscriptionPlanPrices.getPlans",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        SubcriptionPlanStatusMessage.plan.FailedToGetPlans
      );
    }
  }
}
