import axios from "axios";
import { BadRequestException } from "@nestjs/common";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { EventEmitter2 } from "@nestjs/event-emitter";

export class APIs {
  constructor(protected eventEmitter: EventEmitter2) {}

  public async makeAPIGetRequest(url: string): Promise<any> {
    try {
      const { data } = await axios.get(url);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Error.captureStackTrace(error);
        this.eventEmitter.emit("log.system.error", {
          details: {
            service: "GlobalLogService.makeAPIGetRequest",
            payload: url,
            stack: error.stack ? error.stack.toString() : "",
          },
          message: "An axios package error occurred for GET request",
          severity: "HIGH",
        } as SystemErrorLogDTO);
        throw new BadRequestException(
          "A technical error occurred on our end. We are working to fix it"
        );
      } else {
        Error.captureStackTrace(error);
        this.eventEmitter.emit("log.system.error", {
          details: {
            service: "GlobalLogService.makeAPIGetRequest",
            payload: url,
            stack: error?.stack.toString(),
          },
          message: "An API error occurred with message: " + error.message,
          severity: "HIGH",
        } as SystemErrorLogDTO);
        throw new BadRequestException(
          "An error occurred during communication with a third party service"
        );
      }
    }
  }
}
