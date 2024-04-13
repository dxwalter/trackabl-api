import { GlobalRequestResponse } from "../../globals/global.types";
import { SendEmail } from "../../notification/config/notification.types";

export interface AdminType {
  fullname: string;
  email: string;
  accessLevel: string;
  createdAt: Date;
}

export interface CreateAdminData {
  fullname: string;
  email: string;
  password: string;
  accessLevel: string;
  createdAt: Date;
}

export interface CreatAdminAccountResponse {
  status: boolean;
  message: string;
}

export interface loginUserResponse extends GlobalRequestResponse {
  data:
    | AdminType
    | {
        id: number;
        updatedAt: Date;
        createdAt: Date;
        token: string;
      };
}
