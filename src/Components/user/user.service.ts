import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UserModel } from "./models/user.model";
import { UserSignUpPoints } from "./models/user-sign-up-points.model";
import { Utils } from "../utils/index";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  CreateUserAccount,
  UpdateUserAccount,
  CreateUserReferralPoint,
} from "./types/user.types";
import appConfig from "../../Config/app.config";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    @InjectModel(UserSignUpPoints)
    private readonly userReferralPoints: typeof UserSignUpPoints,
    private readonly utils: Utils,
    private jwtService: JwtService,
    protected eventEmitter: EventEmitter2
  ) {}

  async doesThisEmailExists(email: string): Promise<boolean> {
    try {
      const makeRequest = await this.userModel.findOne({
        where: { email },
      });
      if (makeRequest === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking if a user's email exists: ${email}`,
        severity: "MEDIUM",
        details: {
          service: "UserService.doesThisEmailExists",
          payload: email,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async getUserProfileWithToken(token: string): Promise<UserModel | null> {
    try {
      return await this.userModel.findOne({
        where: { emailVerificationCode: token },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message:
          `Error getting the user's profile with email verification token:` +
          { emailVerificationCode: token }.toString(),
        severity: "MEDIUM",
        details: {
          service: "UserService.getUserProfileWithToken",
          payload: token,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async getProfileUsingEmailAddress(email: string): Promise<UserModel | null> {
    try {
      const makeRequest = await this.userModel.findOne({
        where: { email },
      });
      return makeRequest;
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error getting the user's profile with email address: ${email}`,
        severity: "HIGH",
        details: {
          service: "UserService.getProfileUsingEmailAddress",
          payload: email,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async getProfileUsingPhoneNumber(
    phoneNumber: string
  ): Promise<UserModel | null> {
    try {
      const makeRequest = await this.userModel.findOne({
        where: { phoneNumber },
      });
      return makeRequest;
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error getting the user's profile with phone number: ${phoneNumber}`,
        severity: "HIGH",
        details: {
          service: "UserService.getProfileUsingPhoneNumber",
          payload: phoneNumber,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async getProfileUsingReferralCode(code: string): Promise<UserModel | null> {
    try {
      const makeRequest = await this.userModel.findOne({
        where: { referralCode: code },
      });
      return makeRequest;
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error getting the user's profile with referral code: ${code}`,
        severity: "HIGH",
        details: {
          service: "UserService.getProfileUsingReferralCode",
          payload: code,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async getUserProfileUsingID(id: number): Promise<UserModel | null> {
    try {
      const makeRequest = await this.userModel.findOne({
        where: { id },
      });
      return makeRequest;
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error getting the user's profile with user ID: ${id}`,
        severity: "HIGH",

        details: {
          service: "UserService.getUserProfileUsingID",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async generatePasswordForUser(password: string): Promise<string> {
    try {
      return await this.utils.encryptPassword(password);
    } catch (error) {
      this.eventEmitter.emit("log.system.error", {
        message: `Error occurred generating password for user`,
        severity: "HIGH",
        details: {
          service: "UserService.generatePasswordForUser",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);
      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async generateJwtTokenForUser(payload: UserModel): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: appConfig().security.jwtConstant,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error generating JWT`,
        severity: "HIGH",
        details: {
          service: "UserService.generateJwtTokenForUser",
          payload: {
            ...payload,
            password: undefined,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async createUserAccount(userData: CreateUserAccount): Promise<UserModel> {
    try {
      return await this.userModel.create({ ...userData });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error creating user account`,
        severity: "HIGH",
        details: {
          service: "UserService.createUserAccount",
          payload: {
            ...userData,
            password: undefined,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred creating your account");
    }
  }

  async createReferralPoint(
    userData: CreateUserReferralPoint
  ): Promise<UserSignUpPoints> {
    try {
      return await this.userReferralPoints.create({ ...userData });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error creating referral point`,
        severity: "HIGH",
        details: {
          service: "UserService.createReferralPoint",
          payload: {
            ...userData,
            password: undefined,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred creating your referral point"
      );
    }
  }

  async getUserReferralPoints(userId: number): Promise<UserSignUpPoints[]> {
    try {
      return await this.userReferralPoints.findAll({
        where: {
          userId,
        },
        attributes: {
          exclude: ["deletedAt", "updatedAt", "userId"],
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error getting referral point: ${userId}`,
        severity: "HIGH",
        details: {
          service: "UserService.getUserReferralPoints",
          payload: userId,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred getting your referral point"
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateUserProfile(id: number, updateUserDto: UpdateUserAccount) {
    try {
      return await this.userModel.update(
        { ...updateUserDto },
        {
          where: { id },
        }
      );
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error updating user profile with user ID: ${id}`,
        severity: "HIGH",
        details: {
          service: "UserService.getUserReferralPoints",
          payload: {
            userId: id,
            ...updateUserDto,
            password: undefined,
            twoFactorSecret: undefined,
            is2FASet: undefined,
            passwordRecoveryCode: undefined,
            transactionPin: undefined,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred updating your profile");
    }
  }

  async removeAccount(id: number): Promise<any> {
    try {
      await this.userModel.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error deleting user account with ID: ${id}`,
        severity: "HIGH",
        details: {
          service: "UserService.removeAccount",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred deleting your account");
    }
  }
}
