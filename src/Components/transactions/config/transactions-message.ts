/**
 * status messages
 * ---------------------
 * Define all your possible custom status messages here.
 */

export const TransactionResponseMessages = {
  default: "Ok",
  systemToken: {
    TokenNotFound: "An error occurred. The selected token was not found",
  },
  temporalWallet: {
    failedToCreateTemporalWallet:
      "an error occurred creating your temporal wallet",
    failedToUpdateTemporalWallet:
      "an error occurred updating your temporal wallet",
  },
  webhook: {
    confirmDeposit: "Deposit has been confirmed",
  },
};
