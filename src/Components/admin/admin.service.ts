import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { AdminModel } from "./model/admin.model";
import { JwtService } from "@nestjs/jwt";
import { Utils } from "../utils/index";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { CreateAdminData } from "./types/admin.types";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminModel)
    private readonly adminModel: typeof AdminModel,
    private readonly utils: Utils,
    private jwtService: JwtService,
    protected eventEmitter: EventEmitter2
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return "This action adds a new admin";
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  async doesThisEmailExists(email: string): Promise<boolean> {
    try {
      const makeRequest = await this.adminModel.findOne({
        where: { email },
      });
      if (makeRequest === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking if a user's email exists: ${email}`,
        severity: "MEDIUM",
        details: {
          service: "AdminService.doesThisEmailExists",
          payload: email,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async createUserAccount(userData: CreateAdminData): Promise<AdminModel> {
    try {
      return await this.adminModel.create({ ...userData });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error creating admin account`,
        severity: "HIGH",
        details: {
          service: "AdminService.createUserAccount",
          payload: {
            ...userData,
            password: undefined,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred admin account");
    }
  }

  async getProfileUsingEmailAddress(email: string): Promise<AdminModel | null> {
    try {
      const makeRequest = await this.adminModel.findOne({
        where: { email },
      });
      return makeRequest;
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error getting the admin's profile with email address: ${email}`,
        severity: "HIGH",
        details: {
          service: "AdminService.getProfileUsingEmailAddress",
          payload: email,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }
}
