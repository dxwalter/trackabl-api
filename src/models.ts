import { WaitlistUsersPoint } from "./Components/waitlist/models/waitlist-referral-point.model";
import { WaitlistUser } from "./Components/waitlist/models/waitlist-user.model";
import { UserModel } from "./Components/user/models/user.model";
import { UserSignUpPoints } from "./Components/user/models/user-sign-up-points.model";
import { PlatformFeatureStatus } from "./Components/platform-feature-status/models/platform-feature-status.model";
import { SystemTokenModel } from "./Components/transactions/models/system-tokens.model";
import { TemporaryRemittanceModel } from "./Components/transactions/models/temporary-remittances.model";
import { TokenWalletHistory } from "./Components/history/models/token-wallet-history";
import { SystemErrorLogs } from "./Components/globals/model/error-logs.model";
import { AdminModel } from "./Components/admin/model/admin.model";
import { SubcriptionPlanModel } from "./Components/subscription/model/subscription-plans.model";
import { MarketModel } from "./Components/subscription/model/market.model";
import { SubscriptionMarketPricesModel } from "./Components/subscription/model/subcription-market-price.model";
import { IPStackLookupModel } from "./Components/subscription/model/ipstack-lookups.model";
import { UserSubscriptionModel } from "./Components/subscription/model/user-subscriptions.model";
import { CategoriesModel } from "./Components/category/model/categories.model";
import { SuggestedCategoriesModel } from "./Components/category/model/suggested-categories.model";
import { SubcategoriesModel } from "./Components/category/model/subcatgories.model";
import { SuggestedSubcategoriesModel } from "./Components/category/model/suggested-subcatgories.model";

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
  AdminModel,
  SubcriptionPlanModel,
  MarketModel,
  SubscriptionMarketPricesModel,
  IPStackLookupModel,
  UserSubscriptionModel,
  CategoriesModel,
  SuggestedCategoriesModel,
  SubcategoriesModel,
  SuggestedSubcategoriesModel,
];
