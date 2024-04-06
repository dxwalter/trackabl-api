import { GeneralServiceResponse } from "../../../types/global.types";
import { WaitlistUser } from "../models/waitlist-user.model";
import { SendEmail } from "../../notification/config/notification.types";

export interface JoinWaitlistResponse extends GeneralServiceResponse {
  data?: WaitlistUser;
}

export interface CreateNewuser {
  email: string;
  referralCode: string;
}

export interface CreateReferralPoint {
  waitlistUserId: number;
  point: number;
  comment: string;
  state?: string;
  isPointFromReferral: boolean;
}

export interface GetWailistPoinstRespones extends GeneralServiceResponse {
  data: WaitlistUser;
}

export interface JoinWaitlistEmail extends SendEmail {
  referralCode: string;
}

export interface ReferredUserJoinedWithReferralLinkSendEmail extends SendEmail {
  referredUser: string;
}
