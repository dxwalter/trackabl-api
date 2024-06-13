import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateEntrypointDto } from "./dto/create-entrypoint.dto";
import { UpdateEntrypointDto } from "./dto/update-entrypoint.dto";
import { createEntrypoint } from "./type/entrypoint.types";
import { EntrypointStatusMessages } from "./config/entrypoint-response-messages";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";

@Injectable()
export class EntrypointService {
  constructor(protected eventEmitter: EventEmitter2) {}
  async create(
    createEntrypointDto: CreateEntrypointDto
  ): Promise<createEntrypoint> {
    try {
      // check if entrypoint exists for market
      return {
        status: true,
        message: EntrypointStatusMessages.create.success,
      };
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking creating entrypoint entry`,
        severity: "HIGH",
        details: {
          service: "EntrypointService.create",
          payload: createEntrypointDto,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);
      throw new BadRequestException("An error occurred creating entrypoint");
    }
  }

  findAll() {
    return `This action returns all entrypoint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entrypoint`;
  }

  update(id: number, updateEntrypointDto: UpdateEntrypointDto) {
    return `This action updates a #${id} entrypoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} entrypoint`;
  }
}
