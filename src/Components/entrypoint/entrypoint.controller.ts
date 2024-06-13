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
import { EntrypointService } from "./entrypoint.service";
import { getEntryPoint, createEntrypoint } from "./type/entrypoint.types";

import { CreateEntrypointDto } from "./dto/create-entrypoint.dto";
import { UpdateEntrypointDto } from "./dto/update-entrypoint.dto";
import { AuthGuard } from "../user/guard/auth.guard";
import { AdminRoles } from "../../Config/adminRole/admin.roles.decortator";
import { AdminRole } from "../../Config/adminRole/enums/admin.roles";
import { RolesGuard } from "../../Config/roles.guard";

@Controller("entrypoint")
export class EntrypointController {
  constructor(private readonly entrypointService: EntrypointService) {}

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("/")
  async create(
    @Body() createEntrypointDto: CreateEntrypointDto
  ): Promise<createEntrypoint> {
    return this.entrypointService.create(createEntrypointDto);
  }

  @Get("/")
  async findAll() {
    return this.entrypointService.findAll();
  }
}
