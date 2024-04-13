import { AdminService } from "../../admin.service";
import { UserService } from "../../../user/user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AdminStatusMessages } from "../../config/admin-response-message";
import { EmailExists } from "../../exceptions/admin.exceptions";
import { CreateAdminDto } from "../../dto/create-admin.dto";
import { CreatAdminAccountResponse } from "../../types/admin.types";

export class CreateAdminAccount {
  constructor(
    protected readonly adminService: AdminService,
    protected readonly userService: UserService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService
  ) {}

  async createAdmin(
    userBody: CreateAdminDto
  ): Promise<CreatAdminAccountResponse> {
    const userEmail = userBody.email.toLowerCase();

    // check if email exists
    const doesThisEmailExists =
      await this.adminService.doesThisEmailExists(userEmail);

    if (doesThisEmailExists === true) {
      throw new EmailExists();
    }

    // create password
    const newPassword = await this.userService.generatePasswordForUser(
      userBody.password
    );

    // create user account;
    await this.adminService.createUserAccount({
      email: userEmail,
      fullname: userBody.fullname,
      accessLevel: userBody.accessLevel,
      password: newPassword,
      createdAt: new Date(),
    });

    return {
      status: true,
      message: AdminStatusMessages.CreateAccount.success,
    };
  }
}
