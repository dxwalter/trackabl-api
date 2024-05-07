/**
 * status messages
 * ---------------------
 * Define all your possible custom status messages here.
 */

export const PaymentTransactionStatusMessage = {
  default: "Ok",
  user: {
    doesNotExist: "This user does not exist",
  },
  payment: {
    failedVerification: "An error occurred verifying your payment",
    created: "Subscription created successfully",
  },
};
