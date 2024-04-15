/**
 * status messages
 * ---------------------
 * Define all your possible custom status messages here.
 */

export const UserStatusMessages = {
  CreateAccount: {
    success: "Your account has been created successfully",
    email_exists: "This email is already attached to another account",
    phoneNumberExists:
      "This phone number is already attached to another account",
    delete: "You have successfully unsubscribe from the waitlist program",
    maximumTrial: "You have exceed multiple trials to ",
    ok: "Data retrieved",
    invalidEmail: "Enter a valid email address",
    fullnameError: "Tell us your full name",
  },
  EmailVerification: {
    success: "Email address verification is successful",
    invalidToken: "An invalid token provided",
    generateNewToken:
      "A new token has been generated and sent your email address",
    recoverEmailValidation:
      "An email has been sent to the email address you provided",
  },
  Login: {
    failed: "Invalid login credentials",
    success: "Sign in was successful!",
    twoFactorAuthentication:
      "To complete your authentication, log in with your 2FA",
  },
  UserActions: {
    deleteAccount: "Your account has been deleted successfully",
    passwordUpdate: "Your password was updated successfully",
    transactionPinUpdated: "Your transaction pin was updated successfully",
    transactionPinCreated: "Your transaction pin was created successfully",
    wrongTransactionPinlength: "Your transaction must be 4 numbers",
    incorrectTransactionPin: "Your transaction pin was incorrect",
    incorrectPassword: "You provided an incorrect password",
    ok: "Data retrieved",
    updateProfile: "Your profile has been updated successfully",
    noNewData: "No new data to be updated",
  },
  TwoFactorAuthentication: {
    generateQrCode: "QrCode generated successfully",
    verification: "2FA verified successfully",
    failedVerification: "The verification of your 2FA setup failed",
    statusUpdate: "2FA status updated successfully",
  },
};
