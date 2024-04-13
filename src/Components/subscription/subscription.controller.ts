import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../user/guard/auth.guard";
import { UserService } from "../user/user.service";
import { CreatePricePlanDTO } from "../subscription/dto/price.dto";
import { Utils } from "../utils";
import { GlobalErrorService } from "../globals/global.error.service";
import {
  createSubscriptionPlanResponse,
  deleteSubscrptionResponse,
} from "../subscription/types/price.types";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionPlan } from "./classes/SubcriptionPlan";
import { AdminRoles } from "../../Config/adminRole/admin.roles.decortator";
import { AdminRole } from "../../Config/adminRole/enums/admin.roles";
import { RolesGuard } from "../../Config/roles.guard";

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
