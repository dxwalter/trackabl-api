import { BadRequestException } from "@nestjs/common";
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
} from "../../dto/update-user.dto";
import { userProfile } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { UserService } from "../../user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import {
  EmailExists,
  PhoneNumberExists,
  NoNewDataToBeUpdated,
  ProvideFullName,
} from "./../../exceptions/user.exception";

export class UpdateUserProfile {
  constructor(
    private readonly userService: UserService,
    private utils: Utils,
    private readonly GlobalError: GlobalErrorService
  ) {}

  async updateProfile(req: any, payload: UpdateUserDto): Promise<userProfile> {
    this.GlobalError.RequestTrialLimit(payload.trial_count);
    const userId = req.user.id;

    const user = await this.userService.getUserProfileUsingID(userId);

    const oldEmail = user?.email;

    const updatedUserProfile = {};

    // first name
    if (payload.fullname) {
      const splitFullName = payload.fullname.split(" ");

      if (splitFullName.length < 2) {
        throw new ProvideFullName();
      }

      const checkFirstName =
        splitFullName[0].toLowerCase() === user?.firstName.toLowerCase();
      const checkLastName =
        splitFullName[1].toLowerCase() === user?.lastName.toLowerCase();

      if (!checkFirstName || !checkLastName) {
        updatedUserProfile["firstName"] = splitFullName[0];
        updatedUserProfile["lastName"] = splitFullName[1];
      }
    }

    // email address
    if (
      payload.email &&
      payload.email.toLowerCase() !== user?.email.toLowerCase()
    ) {
      // does email exists
      const userEmail = payload.email.toLowerCase();
      this.utils.validateEmail(userEmail);
      const emailStatus = await this.userService.getProfileUsingEmailAddress(
        payload.email
      );

      if (emailStatus) {
        throw new EmailExists();
      }
      updatedUserProfile["email"] = userEmail;
    }

    // check if there is data to be updated
    if (Object.keys(updatedUserProfile).length === 0) {
      throw new NoNewDataToBeUpdated();
    }

    // update
    const updateUserProfile = await this.userService.updateUserProfile(
      userId,
      updatedUserProfile
    );

    if (updatedUserProfile["email"]) {
      // send a message telling the user their email was updated
    }

    if (updateUserProfile[0] !== 1) {
      throw new BadRequestException();
    }

    const getUserProfile = this.utils.plainSequelizeObject(
      await this.userService.getUserProfileUsingID(userId)
    );

    return {
      status: true,
      message: UserStatusMessages.UserActions.updateProfile,
      data: this.utils.deleteSensitiveDataFromUserObject(getUserProfile),
    };
  }
}
