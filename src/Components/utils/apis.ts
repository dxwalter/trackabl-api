import axios from "axios";
import { BadRequestException } from "@nestjs/common";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { EventEmitter2 } from "@nestjs/event-emitter";
import AppConfig from "../../Config/app.config";
import {
  intiatePaystackTransaction,
  InitiatePaystackTransactionResponse,
  verifyPaystackTransactionResponse,
} from "./types/api.types";

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

  public async initializePaystackTransaction(
    payload: intiatePaystackTransaction
  ): Promise<InitiatePaystackTransactionResponse> {
    try {
      const Url = "https://api.paystack.co/transaction/initialize";
      const { data } = await axios.post(Url, payload, {
        headers: {
          Authorization: `Bearer ${AppConfig().paystack.secret}`,
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Error.captureStackTrace(error);
        this.eventEmitter.emit("log.system.error", {
          details: {
            service: "GlobalLogService.initializePaystackTransaction",
            payload: payload,
            stack: error.stack ? error.stack.toString() : "",
          },
          message: "An axios package error intializing paystack transaction",
          severity: "HIGH",
        } as SystemErrorLogDTO);
        throw new BadRequestException(
          "A technical error occurred on our end while creating this transaction"
        );
      } else {
        Error.captureStackTrace(error);
        this.eventEmitter.emit("log.system.error", {
          details: {
            service: "GlobalLogService.initializePaystackTransaction",
            payload: payload,
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

  public async verifyPaystackTransaction(
    reference: string
  ): Promise<verifyPaystackTransactionResponse> {
    try {
      const Url = "https://api.paystack.co/transaction/verify/" + reference;
      const { data } = await axios.get(Url, {
        headers: {
          Authorization: `Bearer ${AppConfig().paystack.secret}`,
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Error.captureStackTrace(error);
        this.eventEmitter.emit("log.system.error", {
          details: {
            service: "GlobalLogService.verifyPaystackTransaction",
            payload: reference,
            stack: error.stack ? error.stack.toString() : "",
          },
          message: "An axios package error intializing paystack transaction",
          severity: "HIGH",
        } as SystemErrorLogDTO);
        throw new BadRequestException(
          "A technical error occurred on our end while verifying your payment"
        );
      } else {
        Error.captureStackTrace(error);
        this.eventEmitter.emit("log.system.error", {
          details: {
            service: "GlobalLogService.verifyPaystackTransaction",
            payload: reference,
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
