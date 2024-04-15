import axios from "axios";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BadRequestException } from "@nestjs/common";
import { PlatformFeatureStatusService } from "../platform-feature-status/platform-status.service";
import { SystemErrorLogs } from "./model/error-logs.model";
import { PlatformFeatureStatus } from "../platform-feature-status/models/platform-feature-status.model";
import { SystemErrorLogDTO } from "./types/globel.types";
import { OnEvent } from "@nestjs/event-emitter";
import dayjs from "dayjs";

const fs = require("fs");
import * as path from "path";

@Injectable()
export class GlobalLogService extends PlatformFeatureStatusService {
  constructor(
    @InjectModel(SystemErrorLogs)
    private readonly systemErrorLog: typeof SystemErrorLogs
  ) {
    super(PlatformFeatureStatus);
  }

  public checkFeature(featureKey: string) {}

  @OnEvent("log.system.error")
  public async createErrorEntry(
    ErrorDetails: SystemErrorLogDTO,
    platform: string = "API"
  ): Promise<boolean> {
    try {
      await this.systemErrorLog.create({
        ...ErrorDetails,
        application: platform,
        statusCode: 0,
      });
    } catch (error) {
      // write error to file for DB
      Error.captureStackTrace(error);
      this.writeErrorToFile(error, error.message);
      // write error to file for system
      this.writeErrorToFile(
        {
          ...ErrorDetails,
          application: platform,
          statusCode: 0,
        },
        ErrorDetails.message
      );
    }

    return true;
  }

  writeErrorToFile(data, message: string = "") {
    try {
      const filePath = path.join(__dirname, "../../../../db-error-log.txt");
      fs.appendFile(
        filePath,
        JSON.stringify({
          ...data,
          message: message,
          createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        }) + "\n",
        function (err) {
          if (err) {
            console.log("Error writing error message to file");
          }
        }
      );
    } catch (error) {
      console.log("Error writing error message");
    }
  }

  public async makeAPIGetRequest(url: string): Promise<any> {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Error.captureStackTrace(error);
        this.createErrorEntry({
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
        this.createErrorEntry({
          details: {
            service: "GlobalLogService.makeAPIGetRequest",
            payload: url,
            stack: error?.stack.toString(),
          },
          message: "An API error occurred with message: " + error.message,
          severity: "HIGH",
        } as SystemErrorLogDTO);
        throw new BadRequestException(error.message);
      }
    }
  }
}
