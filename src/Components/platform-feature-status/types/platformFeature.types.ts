import { GlobalRequestResponse } from "../../globals/global.types";
import { PlatformFeatureStatus } from "../models/platform-feature-status.model";
export interface platformFeatureResponse extends GlobalRequestResponse {
  data: PlatformFeatureStatus;
}
