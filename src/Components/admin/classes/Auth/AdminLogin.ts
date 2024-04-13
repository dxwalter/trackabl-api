import { AdminService } from "../../admin.service";
import { UserService } from "../../../user/user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AdminStatusMessages } from "../../config/admin-response-message";
import {
  EmailExists,
  FailedLoginAttempForAdmin,
} from "../../exceptions/admin.exceptions";
import { LoginAdminDTO } from "../../dto/login-admin.dto";
import { CreatAdminAccountResponse } from "../../types/admin.types";

import { loginUserResponse } from "../../types/admin.types";

export class AdminLogin {
  constructor(
    protected readonly adminService: AdminService,
    protected readonly userService: UserService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService
  ) {}

  async logAdminIn(payload: LoginAdminDTO): Promise<loginUserResponse> {
    this.GlobalError.RequestTrialLimit(payload.trial_count);
    const userEmail = payload.email.toLowerCase();

    this.utils.validateEmail(userEmail);

    // check if email exists
    const getEmail =
      await this.adminService.getProfileUsingEmailAddress(userEmail);

    if (getEmail === null) {
      throw new FailedLoginAttempForAdmin();
    }

    const adminData = this.utils.plainSequelizeObject(getEmail);

    // compare password
    const checkPassword = this.utils.decryptPassword(
      payload.password,
      adminData.password
    );

    if (checkPassword === false) {
      throw new FailedLoginAttempForAdmin();
    }

    const generateToken =
      await this.userService.generateJwtTokenForUser(adminData);

    return {
      data: {
        ...this.utils.deleteSensitiveDataFromUserObject(adminData),
        token: generateToken,
      },
      message: AdminStatusMessages.Login.success,
      status: true,
    };
  }
}
