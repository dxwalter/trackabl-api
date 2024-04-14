import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "../user/guard/auth.guard";
import { UserService } from "../user/user.service";
import { CreatePricePlanDTO } from "../subscription/dto/price.dto";
import { AdminGetAllPrice } from "../subscription/dto/generic-subscription.dto";
import { CreatePricePlan } from "../subscription/dto/create-price-plan.dto";
import { Utils } from "../utils";
import { GlobalErrorService } from "../globals/global.error.service";
import {
  createSubscriptionPlanResponse,
  deleteSubscrptionResponse,
  getMarketsResponse,
  getPlansResponse,
  createPriceResponse,
  getAllMarketPriceResponse,
} from "../subscription/types/price.types";
import { SubscriptionService } from "./subscription.service";
import { AdminRoles } from "../../Config/adminRole/admin.roles.decortator";
import { AdminRole } from "../../Config/adminRole/enums/admin.roles";
import { RolesGuard } from "../../Config/roles.guard";

import { SubscriptionPlan } from "./classes/SubcriptionPlan";
import { SubscriptionPricePlan } from "./classes/CreateSubscriptionPlanPrice";

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService
  ) {}

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("/create-plan")
  async create(
    @Body() createPricePlan: CreatePricePlanDTO
  ): Promise<createSubscriptionPlanResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).create(createPricePlan);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard)
  @Get("/markets")
  async listAllMarkets(): Promise<getMarketsResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).getAllMarkets();
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard)
  @Get("/admin-plans")
  async listAllPlansForAdmin(): Promise<getPlansResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).getAllPlans();
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard)
  @Post("/create-plan-price")
  async mapPlanToMarket(
    @Body() createPricePlan: CreatePricePlan
  ): Promise<createPriceResponse> {
    return await new SubscriptionPricePlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).create(createPricePlan);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard)
  @Get("/admin-get-plans")
  async adminGetAllPlans(
    @Query() query: AdminGetAllPrice
  ): Promise<getAllMarketPriceResponse> {
    return await new SubscriptionPricePlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).getAllPrice(query.marketId);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard)
  @Delete("/price/:id")
  async deletePrice(
    @Param("id") id: number
  ): Promise<deleteSubscrptionResponse> {
    return new SubscriptionPricePlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).delete(id);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard)
  @Delete("/plan/:id")
  async deletePlan(
    @Param("id") id: number
  ): Promise<deleteSubscrptionResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).delete(id);
  }
}
