// eslint-disable-next-line @typescript-eslint/no-var-requires
import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";
import { SendMailClient } from "zeptomail";
import { Utils } from "../utils";
import {
  JoinWaitlistEmail,
  ReferredUserJoinedWithReferralLinkSendEmail,
} from "../waitlist/types/waitlist.types";

import {
  JoinedWellatSendEmail,
  JoinedWellatVerifyEmailSendEmail,
  RecoverPasswordSendEmail,
  ReferralCodeUsedEmail,
} from "../user/types/user.types";

import configuration from "../../Config/app.config";

import { SendEmail, SaveEmailResponse } from "./config/notification.types";
import {
  GetNewWaitistSignUpEmailBody,
  GetWaitlistReferredEmailBody,
  GetEmailBodyWithPath,
} from "./config/emailBody.config";

@Injectable()
export class NotificationService {
  constructor(private utils: Utils) {}

  @OnEvent("send.email.waitlist")
  async GetEmailBodyForWaitlist(
    data: JoinWaitlistEmail & ReferredUserJoinedWithReferralLinkSendEmail
  ) {
    if (process.env.NODE_ENV === "test") return true;

    let senderEmailAddress = "noreply@mywellat.com";
    const referralLink =
      configuration().environment.env === "development"
        ? `https://${
            configuration().zeptoMail.wellatDevelopmentDomain
          }/referral/`
        : `https://${configuration().zeptoMail.wellatDomain}/referral/`;

    let emailBody = "";

    /**
     * WAITLIST EMAIL
     */

    if (data.emailType === "NewUserJoinedWaitlist") {
      // this is when a new user joins the waitlist
      emailBody = GetNewWaitistSignUpEmailBody();

      emailBody = emailBody
        .replace(/{{fullname}}/, data.recipientName)
        .replace(/{{ReferralLink}}/, `${referralLink}${data.referralCode}`);
    }

    if (data.emailType === "ReferredUserJoinedWaitlist") {
      // This is the email a user gets when another user registers with their referral link
      emailBody = GetWaitlistReferredEmailBody();

      emailBody = emailBody
        .replace(/{{fullname}}/, data.recipientName)
        .replace(/{{FriendsName}}/, `${data.referredUser}`);
    }

    if (emailBody.length) {
      this.SendEmail({
        ...data,
        emailBody,
        senderEmailAddress,
      });
    }
  }

  @OnEvent("send.email.authentication")
  async GetEmailBodyForAuthentication(
    data: JoinedWellatSendEmail &
      JoinedWellatVerifyEmailSendEmail &
      RecoverPasswordSendEmail &
      ReferralCodeUsedEmail
  ) {
    if (process.env.NODE_ENV === "test") return true;
    /**
     * AUTHENTICATION EMAIL
     */

    let senderEmailAddress = "noreply@mywellat.com";
    const referralLink =
      configuration().environment.env === "development"
        ? `https://${configuration().zeptoMail.wellatDevelopmentDomain}/create`
        : `https://${configuration().zeptoMail.wellatDomain}/create`;

    let emailBody = "";

    if (data.emailType === "NewUserAccountSignUp") {
      // When a user signs up
      emailBody = GetEmailBodyWithPath("/Authentication/WelcomeToWellat.html");

      emailBody = emailBody
        .replace(/{{fullname}}/, data.recipientName)
        .replace(
          /{{ReferralLink}}/,
          `${referralLink}?referralCode=${data.referralCode}`
        );
    }

    if (data.emailType === "NewUserAccountEmailVerification") {
      // When a user signs up
      emailBody = GetEmailBodyWithPath("/Authentication/VerifyEmail.html");

      emailBody = emailBody
        .replace(/{{fullname}}/, data.recipientName)
        .replace(
          /{{VerificationLink}}/,
          `${referralLink}?token=${data.verificationCode}&email=${data.recipientEmail}`
        );
    }

    if (data.emailType === "RecoverUserPassword") {
      // When a user signs up
      emailBody = GetEmailBodyWithPath("/Authentication/RecoverPassword.html");

      emailBody = emailBody
        .replace(/{{fullname}}/, data.recipientName)
        .replace(
          /{{RecoverPassordLink}}/,
          `${data.redirectPath}?token=${data.recoveryCode}&email=${data.recipientEmail}`
        );
    }

    if (data.emailType === "ReferralCodeUsedDuringSignUp") {
      // When a user signs up using another user's referral code
      emailBody = GetEmailBodyWithPath(
        "/Authentication/SignUpReferralEmail.html"
      );

      emailBody = emailBody
        .replace(/{{fullname}}/, data.fullname)
        .replace(/{{FriendsName}}/, data.FriendsName);
    }

    if (emailBody.length) {
      this.SendEmail({
        ...data,
        emailBody,
        senderEmailAddress,
      });
    }
  }

  async SendEmail(data: SendEmail) {
    if (process.env.NODE_ENV === "test") return true;

    const doesDomainExists = await new Utils().checkDomainExistence(
      data.recipientEmail.split("@")[1]
    );

    if (doesDomainExists === false || data.senderEmailAddress === undefined) {
      return false;
    }

    const url = "api.zeptomail.com/";
    const token = configuration().zeptoMail.token;

    const client = new SendMailClient({ url, token });

    try {
      const makeRequest = await client.sendMail({
        from: {
          address: data.senderEmailAddress,
          name: "Wellat",
        },
        to: [
          {
            email_address: {
              address: data.recipientEmail,
              name: data.recipientName,
            },
          },
        ],
        subject: data.subject,
        htmlbody: data.emailBody,
      });

      return makeRequest;
    } catch (error) {
      await this.saveEmailResponseLog({
        data: error,
        receiver: data.recipientEmail.toString(),
        status: false,
        subject: data.subject,
      });
    }
  }

  async saveEmailResponseLog(data: SaveEmailResponse) {
    // try {
    // } catch (error) {
    // }
    return data;
  }
}
