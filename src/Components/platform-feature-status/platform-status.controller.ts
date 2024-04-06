import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PlatformFeatureStatusService } from "./platform-status.service";
import { CreatePlatformFeatureStatusDto } from "./dto/create-platform-status.dto";
import { UpdatePlatformStatusDto } from "./dto/update-platform-status.dto";
import { CreatePlaformFeature } from "./classes/CreateNewPlatformFeature";
import { GlobalRequestResponse } from "../globals/global.types";
import { platformFeatureResponse } from "./types/platformFeature.types";
import { Utils } from "../utils/index";

@Controller("platform-feature")
export class PlatformFeatureStatusController {
  constructor(
    private readonly platformStatusService: PlatformFeatureStatusService,
    private readonly utils: Utils
  ) {}

  @Post("/create")
  async create(
    @Body() createPlatformStatusDto: CreatePlatformFeatureStatusDto
  ): Promise<platformFeatureResponse> {
    return await new CreatePlaformFeature(
      this.platformStatusService,
      this.utils
    ).createFeature(createPlatformStatusDto);
  }

  @Get()
  findAll() {
    return this.platformStatusService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    // return this.platformStatusService.findOne(+id);
  }

  @Patch("/update/:id")
  async update(@Param("id") id: string): Promise<GlobalRequestResponse> {
    return await new CreatePlaformFeature(
      this.platformStatusService,
      this.utils
    ).updateStatus(+id);
  }

  @Delete("/delete/:id")
  async remove(@Param("id") id: string): Promise<GlobalRequestResponse> {
    return await new CreatePlaformFeature(
      this.platformStatusService,
      this.utils
    ).deleteFeature(+id);
  }
}
