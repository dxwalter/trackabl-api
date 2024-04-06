import { UserService } from "../../user.service";
import { Utils } from "../../../utils";
import { GlobalErrorService } from "../../../globals/global.error.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateUserDto } from "../../dto/create-user.dto";
import {
  createUserResponse,
  ReferralCodeUsedEmail,
  JoinedWellatVerifyEmailSendEmail,
  JoinedWellatSendEmail,
} from "../../types/user.types";
import { UserStatusMessages } from "../../config/user-response-message";
import { EmailExists } from "../../exceptions/user.exception";

export class AuthCreateUserAccount {
  constructor(
    protected readonly userService: UserService,
    protected utils: Utils,
    protected readonly GlobalError: GlobalErrorService,
    protected eventEmitter: EventEmitter2
  ) {}

  async createAccount(userBody: CreateUserDto): Promise<createUserResponse> {
    this.GlobalError.RequestTrialLimit(userBody.trial_count);
    await this.GlobalError.checkFeature("SIGNUP");

    const userEmail = userBody.email.toLowerCase();

    this.utils.validateEmail(userEmail);

    // check if email exists
    const doesThisEmailExists =
      await this.userService.doesThisEmailExists(userEmail);

    if (doesThisEmailExists === true) {
      throw new EmailExists();
    }

    // create password
    const newPassword = await this.userService.generatePasswordForUser(
      userBody.password
    );

    const randomStringForEmailVerification = this.utils.generateEmailToken();

    // Generate referral code
    const referralCode = this.utils.generateReferralCode();

    // create user account;
    const newUser = await this.userService.createUserAccount({
      email: userEmail,
      acceptedTCAndPP: userBody.tcAndPpAcceptedDate,
      emailVerificationCode: randomStringForEmailVerification,
      firstName: userBody.firstName,
      lastName: userBody.lastName,
      referralCode: referralCode[0],
      isEmailVerified: false,
      password: newPassword,
      createdAt: new Date(),
    });

    const generateToken = await this.userService.generateJwtTokenForUser(
      this.utils.plainSequelizeObject(newUser)
    );

    // create free point for user sign up
    await this.userService.createReferralPoint({
      comment: `You Joined Wellat`,
      isPointFromReferral: false,
      point: 100,
      state: "INITIAL_PARTICIPATION",
      userId: newUser.id,
    });

    // send email
    this.eventEmitter.emit("send.email.authentication", {
      emailBody: "text",
      recipientEmail: userEmail,
      subject: `Welcome to Wellat - Empower Your Crypto Journey!`,
      recipientName: userBody.firstName,
      emailType: "NewUserAccountSignUp",
      referralCode: referralCode[0],
    } as JoinedWellatSendEmail);

    // Send email verification
    this.sendEmailVerification({
      recipientEmail: userEmail,
      recipientName: userBody.firstName,
      verificationCode: randomStringForEmailVerification,
    });

    // if user has referral code set
    if (userBody.referral_code) {
      const getUserUsingReferralCode =
        await this.userService.getProfileUsingReferralCode(
          userBody.referral_code
        );

      if (getUserUsingReferralCode) {
        // create points
        await this.userService.createReferralPoint({
          comment: `${userBody.firstName} ${userBody.lastName} joined Wellat using your referral code`,
          isPointFromReferral: true,
          point: 100,
          state: "REFERRED_PARTICPATION",
          userId: getUserUsingReferralCode.id, // this is the ID of the user whose referral code was used
        });

        // send email to the owner of the referral code
        this.eventEmitter.emit("send.email.authentication", {
          emailBody: "text",
          recipientEmail: getUserUsingReferralCode.email,
          subject: `Exciting News! Your Referral = Bitcoin Points!`,
          emailType: "ReferralCodeUsedDuringSignUp",
          FriendsName: `${userBody.firstName} ${userBody.lastName}`,
          fullname:
            getUserUsingReferralCode.firstName +
            " " +
            getUserUsingReferralCode.lastName,
        } as ReferralCodeUsedEmail);
      }
    }

    const newUserObject = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,

      acceptedTCAndPP: newUser.acceptedTCAndPP,
    };

    return {
      status: true,
      message: UserStatusMessages.CreateAccount.success,
      data: {
        ...this.utils.plainSequelizeObject(
          this.utils.deleteSensitiveDataFromUserObject(newUser)
        ),
        token: generateToken,
        referralCode: referralCode[0],
        emailVerificationCode:
          process.env.NODE_ENV === "test"
            ? randomStringForEmailVerification
            : undefined,
        email: userEmail,
        id: newUser.id,
        isEmailVerified: false,
        isTransactionPinSet: false,
      },
    };
  }

  sendEmailVerification(data: {
    recipientEmail: string;
    recipientName: string;
    verificationCode: string;
  }) {
    // Send email verification
    this.eventEmitter.emit("send.email.authentication", {
      emailBody: "text",
      recipientEmail: data.recipientEmail,
      subject: `Verify Your Wellat Account - Let's Secure Your Crypto Journey!`,
      recipientName: data.recipientName,
      emailType: "NewUserAccountEmailVerification",
      verificationCode: data.verificationCode,
    } as JoinedWellatVerifyEmailSendEmail);
  }
}
