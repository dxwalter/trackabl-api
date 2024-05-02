import { GlobalRequestResponse } from "../../globals/global.types";
import { SendEmail } from "../../notification/config/notification.types";

export interface CreateUserAccount {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationCode: string;
  createdAt: Date;
  referralCode: string;
}

export interface CreateUserReferralPoint {
  userId: number;
  point: number;
  comment: string;
  state: string;
  isPointFromReferral: boolean;
}

export interface createUserResponse extends GlobalRequestResponse {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
    isEmailVerified: boolean;
    acceptedTCAndPP: Date;
    token: string;
    id: number;
  };
}

export interface loginUserResponse extends GlobalRequestResponse {
  data:
    | createUserResponse
    | {
        id: number;
        updatedAt: Date;
        createdAt: Date;
      };
}

export interface two2FALoginUserResponse extends GlobalRequestResponse {
  data: {
    is2FASet: boolean;
  };
}

export interface generateEmailVerificationTokenResponse
  extends GlobalRequestResponse {
  emailVerificationCode?: string | undefined;
  passwordResetCode?: string | undefined;
}

export interface deleteUserAccountResponse extends GlobalRequestResponse {}

export interface defaultResponse extends GlobalRequestResponse {}

export interface UpdateUserAccount {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  activeSubscriptionId?: number;
  isSubscriptionActive?: boolean;
  transactionPin?: string;
  isEmailVerified?: boolean;
  emailVerificationCode?: string;
  passwordRecoveryCode?: string;
  referralCode?: string;
  is2FASet?: boolean;
  twoFactorSecret?: string;
  updatedAt?: Date;
}

export interface JoinedWellatSendEmail extends SendEmail {
  referralCode: string;
}

export interface JoinedWellatVerifyEmailSendEmail extends SendEmail {
  verificationCode: string;
}

export interface RecoverPasswordSendEmail extends SendEmail {
  recoveryCode: string;
  redirectPath: string;
}

export interface ReferralCodeUsedEmail extends SendEmail {
  fullname: string;
  FriendsName: string;
}

export interface UserReferralPoints {
  id: number;
  userId: number;
  point: number;
  comment: string;
  state: string;
  isPointFromReferral: boolean;
  createdAt: Date;
}
export interface getUserReferralPoints extends GlobalRequestResponse {
  data: UserReferralPoints[];
}

export interface generate2FAQrCode extends GlobalRequestResponse {
  data: {
    qrCode: string;
    secret: number;
  };
}

export interface UserProfileType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  isEmailVerified: boolean;
  acceptedTCAndPP: Date;
  updatedAt: Date;
}

export interface userProfile extends GlobalRequestResponse {
  data: UserProfileType;
}
