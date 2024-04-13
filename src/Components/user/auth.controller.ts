import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
/* eslint-disable @typescript-eslint/no-var-requires */

import { UserService } from "./user.service";
import { Utils } from "../utils";
import { GlobalErrorService } from "../globals/global.error.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDTO, LoginUserWith2FADTO } from "./dto/login-user.dto";
import { AuthGuard } from "./guard/auth.guard";
import {
  VerifyUserEmailDTO,
  GenerateUserEmailVerificationTokenDTO,
  RecoverPasswordValidator,
  ChangeUnauthenticatedUserPassword,
  Verify2FASetup,
  Update2FAStatus,
} from "./dto/verify-user-email.dto";

import {
  createUserResponse,
  loginUserResponse,
  two2FALoginUserResponse,
  defaultResponse,
  generateEmailVerificationTokenResponse,
  generate2FAQrCode,
} from "./types/user.types";
import { GlobalRequestResponse } from "../globals/global.types";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { AuthCreateUserAccount } from "./classes/auth/AuthCreateAccount";
import { AuthLoginUser } from "./classes/auth/AuthLoginUser";
import { AuthLoginUserWith2FA } from "./classes/auth/AuthLoginWith2FA";
import { AuthVerifyUserEmail } from "./classes/auth/AuthVerifyUserEmail";
import { AuthGenerateEmailVerificationToken } from "./classes/auth/AuthGenerateEmailVerificationToken";
import { AuthRecoverUserPassword } from "./classes/auth/AuthRecoverPassword";
import { AuthUpdateUserPassword } from "./classes/auth/AuthUpdatePassword";
import { AuthSetup2FA } from "./classes/auth/AuthSetup2FA";
import { AuthVerify2FASetup } from "./classes/auth/AuthVerify2FASetup";
import { AuthUpdate2FAStatus } from "./classes/auth/AuthUpdate2FAStatus";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService,
    private eventEmitter: EventEmitter2
  ) {}

  @Post("/create")
  async createUser(
    @Body() userBody: CreateUserDto
  ): Promise<createUserResponse> {
    return await new AuthCreateUserAccount(
      this.userService,
      this.utils,
      this.globalError,
      this.eventEmitter
    ).createAccount(userBody);
  }

  @Post("/login")
  async loginUser(
    @Body() payload: LoginUserDTO
  ): Promise<loginUserResponse | two2FALoginUserResponse> {
    return await new AuthLoginUser(
      this.userService,
      this.utils,
      this.globalError
    ).loginUser(payload);
  }

  @Post("/login-2fa")
  async loginUserWith2FA(
    @Body() payload: LoginUserWith2FADTO
  ): Promise<loginUserResponse | two2FALoginUserResponse> {
    return await new AuthLoginUserWith2FA(
      this.userService,
      this.utils,
      this.globalError
    ).loginUserWith2FA(payload);
  }

  @Patch("/verify-email/:id")
  async verifyUserEmail(
    @Param("id") id: string,
    @Body() verifyUserEmailData: VerifyUserEmailDTO
  ): Promise<defaultResponse> {
    return await new AuthVerifyUserEmail(
      this.userService,
      this.globalError
    ).verifyUserEmail(id, verifyUserEmailData);
  }

  @Patch("/generate-verifcation-token")
  async generateUserEmailVerificationCode(
    @Body() generateEmailToken: GenerateUserEmailVerificationTokenDTO
  ): Promise<generateEmailVerificationTokenResponse> {
    return await new AuthGenerateEmailVerificationToken(
      this.userService,
      this.utils,
      this.globalError,
      this.eventEmitter
    ).generateEmailToken(generateEmailToken);
  }

  @Patch("/recover-password")
  async recoverPasswordValidator(
    @Body() userData: RecoverPasswordValidator
  ): Promise<generateEmailVerificationTokenResponse> {
    return await new AuthRecoverUserPassword(
      this.userService,
      this.utils,
      this.globalError,
      this.eventEmitter
    ).sendRecoveryTokenAsEmail(userData);
  }

  @Patch("/update-password")
  async updatePassword(
    @Body() userData: ChangeUnauthenticatedUserPassword
  ): Promise<GlobalRequestResponse> {
    return await new AuthUpdateUserPassword(
      this.userService,
      this.globalError
    ).changeUserPassword(userData);
  }

  @UseGuards(AuthGuard)
  @Get("/setup-2fa")
  async get2FACode(@Request() req: any): Promise<generate2FAQrCode> {
    return await new AuthSetup2FA().generateQRCode();
  }

  @UseGuards(AuthGuard)
  @Patch("/verify-2fa")
  async validate2FA(
    @Request() req: any,
    @Body() verificationData: Verify2FASetup
  ): Promise<GlobalRequestResponse> {
    return await new AuthVerify2FASetup(
      this.userService,
      this.globalError
    ).validate(req, verificationData);
  }

  @UseGuards(AuthGuard)
  @Patch("/change-2fa-status")
  async change2FAStatus(
    @Request() req: any,
    @Body() payload: Update2FAStatus
  ): Promise<GlobalRequestResponse> {
    return new AuthUpdate2FAStatus(this.userService, this.globalError).update(
      req,
      payload
    );
  }
}
