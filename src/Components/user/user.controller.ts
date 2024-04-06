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
import { UserService } from "./user.service";
import { InternalServerErrorException } from "@nestjs/common";
import { Utils } from "../utils";
import { AuthGuard } from "./guard/auth.guard";
import { GlobalErrorService } from "../globals/global.error.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateTransactionPin,
  CreateTransactionPin,
} from "./dto/update-user.dto";
import { UserStatusMessages } from "./config/user-response-message";
import { GlobalRequestResponse } from "../globals/global.types";

import {
  createUserResponse,
  deleteUserAccountResponse,
  getUserReferralPoints,
  userProfile,
} from "./types/user.types";

import { UserGetUserProfile } from "./classes/user/GetUserProfile";
import { UpdateUserProfile } from "./classes/user/UpdateUserProfile";
import { UpdateUserPassword } from "./classes/user/UpdateUserPassword";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService
  ) {}

  @UseGuards(AuthGuard)
  @Get("/")
  async getUserProfile(@Request() req: any): Promise<userProfile> {
    return await new UserGetUserProfile(
      this.userService,
      this.utils
    ).retrieveData(req);
  }

  @UseGuards(AuthGuard)
  @Get("/referral-points")
  async getAllReferralPoints(
    @Request() req: any
  ): Promise<getUserReferralPoints> {
    const userId = req.user.id;

    return {
      status: true,
      message: UserStatusMessages.UserActions.ok,
      data: await this.userService.getUserReferralPoints(userId),
    };
  }

  @UseGuards(AuthGuard)
  @Patch("/update-profile")
  async update(
    @Request() req: any,
    @Body() payload: UpdateUserDto
  ): Promise<userProfile> {
    return new UpdateUserProfile(
      this.userService,
      this.utils,
      this.GlobalError
    ).updateProfile(req, payload);
  }

  // Security
  @UseGuards(AuthGuard)
  @Patch("/security/change-password")
  async changeUserPassword(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserPasswordDto
  ): Promise<GlobalRequestResponse> {
    return await new UpdateUserPassword(
      this.userService,
      this.utils,
      this.GlobalError
    ).updatePassword(req, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Post("/security/transaction-pin")
  async createNewTransactionPin(
    @Request() req: any,
    @Body() createPinDto: CreateTransactionPin
  ): Promise<GlobalRequestResponse> {
    return await new UpdateUserPassword(
      this.userService,
      this.utils,
      this.GlobalError
    ).createTransactionPin(req, createPinDto);
  }

  @UseGuards(AuthGuard)
  @Patch("/security/transaction-pin")
  async changeTransactionPin(
    @Request() req: any,
    @Body() updateUserDto: UpdateTransactionPin
  ): Promise<GlobalRequestResponse> {
    return await new UpdateUserPassword(
      this.userService,
      this.utils,
      this.GlobalError
    ).updateTransactionPin(req, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async remove(@Request() req: any): Promise<deleteUserAccountResponse> {
    // if (process.env.NODE_ENV !== "test") {
    //   throw new InternalServerErrorException();
    // }

    const userId = req.user.id;

    await this.userService.removeAccount(userId);

    return {
      status: true,
      message: UserStatusMessages.UserActions.deleteAccount,
    };
  }
}
