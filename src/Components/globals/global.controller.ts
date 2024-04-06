import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";

@Controller("global")
export class GlobalModuleController {}
