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
  Request,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "../user/guard/auth.guard";
import { UserService } from "../user/user.service";
import { CreatePricePlanDTO } from "../subscription/dto/price.dto";
import { AdminGetAllPrice } from "../subscription/dto/generic-subscription.dto";
import { CreatePricePlan } from "../subscription/dto/create-price-plan.dto";
import { ActivateFreeSubscriptionPlanDto } from "./dto/create-subscription.dto";
import { Utils } from "../utils";
import { APIs } from "../utils/apis";
import { GlobalErrorService } from "../globals/global.error.service";
import {
  createSubscriptionPlanResponse,
  deleteSubscrptionResponse,
  getMarketsResponse,
  getPlansResponse,
  createPriceResponse,
  getAllMarketPriceResponse,
  activateFreePlanResponse,
  userSubscriptionListResponse,
} from "../subscription/types/price.types";
import { SubscriptionService } from "./subscription.service";
import { AdminRoles } from "../../Config/adminRole/admin.roles.decortator";
import { AdminRole } from "../../Config/adminRole/enums/admin.roles";
import { RolesGuard } from "../../Config/roles.guard";

import { SubscriptionPlan } from "./classes/SubcriptionPlan";
import { SubscriptionPricePlan } from "./classes/CreateSubscriptionPlanPrice";
import { GetSubscriptionPlanPrices } from "./classes/GetSubscriptionPrices";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService,
    private readonly apis: APIs,
    protected eventEmitter: EventEmitter2,
    protected userService: UserService
  ) {}

  @UseGuards(AuthGuard)
  @Get("/")
  async getUserPastSubscriptions(
    @Request() req: any
  ): Promise<userSubscriptionListResponse> {
    return await new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.eventEmitter,
      this.userService
    ).listUserSubscriptions(req);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("/create-plan")
  async create(
    @Body() createPricePlan: CreatePricePlanDTO
  ): Promise<createSubscriptionPlanResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.eventEmitter,
      this.userService
    ).create(createPricePlan);
  }

  @UseGuards(AuthGuard)
  @Get("/plans")
  async GetPlansForUser(
    @Request() req: any
  ): Promise<getAllMarketPriceResponse> {
    return await new GetSubscriptionPlanPrices(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.apis,
      this.eventEmitter
    ).getPlans(req);
  }

  @UseGuards(AuthGuard)
  @Post("/activate-free-plan")
  async ActivateFreePlan(
    @Request() req: any,
    @Body() data: ActivateFreeSubscriptionPlanDto
  ): Promise<activateFreePlanResponse> {
    return await new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.eventEmitter,
      this.userService
    ).activateFreeSubscriptionPlan(req, data);
  }

  @UseGuards(AuthGuard)
  @Delete("/user-subscription/:id")
  async deleteUserSubscription(
    @Param("id") id: number
  ): Promise<deleteSubscrptionResponse> {
    if (process.env.NODE_ENV !== "test") {
      throw new BadRequestException(
        "This feature is unavailable at the moment"
      );
    }
    return new SubscriptionPricePlan(
      this.subscriptionService,
      this.utils,
      this.globalError
    ).deleteUserSubscription(id);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get("/markets")
  async listAllMarkets(): Promise<getMarketsResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.eventEmitter,
      this.userService
    ).getAllMarkets();
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get("/admin-plans")
  async listAllPlansForAdmin(): Promise<getPlansResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.eventEmitter,
      this.userService
    ).getAllPlans();
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Delete("/plan/:id")
  async deletePlan(
    @Param("id") id: number
  ): Promise<deleteSubscrptionResponse> {
    return new SubscriptionPlan(
      this.subscriptionService,
      this.utils,
      this.globalError,
      this.eventEmitter,
      this.userService
    ).delete(id);
  }
}
