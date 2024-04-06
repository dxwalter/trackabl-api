import { BadRequestException } from "@nestjs/common";
import {
  UpdateUserPasswordDto,
  UpdateTransactionPin,
  CreateTransactionPin,
} from "../../dto/update-user.dto";
import { userProfile } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { UserService } from "../../user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import {
  IncorrectPasswordException,
  InvalidTransactionPin,
  InvalidTransactionPinLength,
} from "./../../exceptions/user.exception";
import { GlobalRequestResponse } from "../../../globals/global.types";

export class UpdateUserPassword {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService
  ) {}

  async updatePassword(
    req: any,
    updateUserDto: UpdateUserPasswordDto
  ): Promise<GlobalRequestResponse> {
    this.GlobalError.RequestTrialLimit(updateUserDto.trial_count);
    const userId = req.user.id;
    const userProfile = this.utils.plainSequelizeObject(
      await this.userService.getUserProfileUsingID(userId)
    );
    const verifyPassword = this.utils.decryptPassword(
      updateUserDto.oldPassword,
      userProfile.password
    );

    if (verifyPassword === false) {
      throw new IncorrectPasswordException();
    }

    const newPassword = await this.userService.generatePasswordForUser(
      updateUserDto.newPassword
    );

    const updateUserProfile = await this.userService.updateUserProfile(userId, {
      password: newPassword,
    });

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    return {
      status: true,
      message: UserStatusMessages.UserActions.passwordUpdate,
    };
  }

  async createTransactionPin(
    req: any,
    updateUserDto: CreateTransactionPin
  ): Promise<GlobalRequestResponse> {
    this.GlobalError.RequestTrialLimit(updateUserDto.trial_count);
    const userId = req.user.id;
    const userPin = updateUserDto.pin.toString();

    if (userPin.length != 4) {
      throw new InvalidTransactionPinLength();
    }

    // create pin
    const pin = await this.userService.generatePasswordForUser(userPin);

    const updateUserProfile = await this.userService.updateUserProfile(userId, {
      transactionPin: pin,
    });

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    return {
      status: true,
      message: UserStatusMessages.UserActions.transactionPinCreated,
    };
  }

  async updateTransactionPin(
    req: any,
    updateUserDto: UpdateTransactionPin
  ): Promise<GlobalRequestResponse> {
    this.GlobalError.RequestTrialLimit(updateUserDto.trial_count);
    const userId = req.user.id;

    const userProfile = this.utils.plainSequelizeObject(
      await this.userService.getUserProfileUsingID(userId)
    );

    const oldPin = updateUserDto.oldPin.toString();
    const newPin = updateUserDto.newPin.toString();

    const checkPinStatus = this.utils.decryptPassword(
      oldPin,
      userProfile.transactionPin
    );

    if (checkPinStatus === false) {
      throw new InvalidTransactionPin();
    }

    if (newPin.length != 4) {
      throw new InvalidTransactionPinLength();
    }

    // create pin
    const pin = await this.userService.generatePasswordForUser(newPin);

    const updateUserProfile = await this.userService.updateUserProfile(userId, {
      transactionPin: pin,
    });

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    return {
      status: true,
      message: UserStatusMessages.UserActions.transactionPinUpdated,
    };
  }
}
