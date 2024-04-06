import { Controller, Get } from "@nestjs/common";
import { StatusService } from "./status.service";
import { GeneralServiceResponse } from "../../types/global.types";

@Controller("status")
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  findAll(): GeneralServiceResponse {
    return {
      status: true,
      message: "Application server is up and running",
    };
  }
}
