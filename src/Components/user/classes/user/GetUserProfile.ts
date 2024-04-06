/* eslint-disable @typescript-eslint/no-var-requires */
import { userProfile } from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { UserService } from "../../user.service";
import { Utils } from "../../../utils";

export class UserGetUserProfile {
  constructor(
    private readonly userService: UserService,
    private utils: Utils
  ) {}

  async retrieveData(req: any): Promise<userProfile> {
    const userId = req.user.id;
    const getProfile = this.utils.plainSequelizeObject(
      await this.userService.getUserProfileUsingID(userId)
    );

    return {
      status: true,
      message: UserStatusMessages.UserActions.ok,
      data: {
        ...this.utils.deleteSensitiveDataFromUserObject(getProfile),
        isTransactionPinSet: getProfile.transactionPin === null ? false : true,
      },
    };
  }
}
