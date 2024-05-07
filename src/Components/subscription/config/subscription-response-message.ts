/**
 * status messages
 * ---------------------
 * Define all your possible custom status messages here.
 */

export const SubcriptionPlanStatusMessage = {
  default: "Ok",
  plan: {
    exist: "This subscription plan exists.",
    created: "Subscription plan created successfully",
    deleted: "Subscription plan deleted successfully",
    priceCreated: "Subscription price created successfully",
    priceExists: "Subscription price exists for this market",
    priceDoesNotExist: "Subscription price does not exist",
    PriceDeleted: "Subscription plan price deleted successfully",
    FailedToGetPlans:
      "An error occurred getting plans. Kindly try again shortly",
  },
  user: {
    subscriptionPlanActivated:
      "Your subscription plan was activated successfully",
    freePlanActivated: "Your free trial period has been activated",
    deletePlan: "Your subscription was deleted successfully",
  },
};
