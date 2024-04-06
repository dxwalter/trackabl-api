import { WaitlistUsersPoint } from "./Components/waitlist/models/waitlist-referral-point.model";
import { WaitlistUser } from "./Components/waitlist/models/waitlist-user.model";
import { UserModel } from "./Components/user/models/user.model";
import { UserSignUpPoints } from "./Components/user/models/user-sign-up-points.model";
import { PlatformFeatureStatus } from "./Components/platform-feature-status/models/platform-feature-status.model";
import { SystemTokenModel } from "./Components/transactions/models/system-tokens.model";
import { TemporaryRemittanceModel } from "./Components/transactions/models/temporary-remittances.model";
import { TokenWalletHistory } from "./Components/history/models/token-wallet-history";
import { SystemErrorLogs } from "./Components/globals/model/error-logs.model";

export const models = [
  WaitlistUsersPoint,
  WaitlistUser,
  UserModel,
  UserSignUpPoints,
  PlatformFeatureStatus,
  SystemTokenModel,
  TemporaryRemittanceModel,
  TokenWalletHistory,
  SystemErrorLogs,
];
