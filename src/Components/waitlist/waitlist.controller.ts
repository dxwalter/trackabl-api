import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { WaitlistService } from "./waitlist.service";
import { CreateWaitlistDto } from "./dto/create-waitlist.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  JoinWaitlistResponse,
  GetWailistPoinstRespones,
  JoinWaitlistEmail,
  ReferredUserJoinedWithReferralLinkSendEmail,
} from "./types/waitlist.types";
import { WaitlistStatusMessages } from "./config/waitlist-status-message";
import {
  MaximumTrialCount,
  EmailExistsInWaitlist,
  InvalidEmailException,
} from "./exceptions/waitlist.exception";
import { Utils } from "../utils";

@Controller("waitlist")
export class WaitlistController {
  constructor(
    private readonly waitlistService: WaitlistService,
    private utils: Utils,
    private eventEmitter: EventEmitter2
  ) {}

  @Post("/join")
  async create(
    @Body() createWaitlistDto: CreateWaitlistDto
  ): Promise<JoinWaitlistResponse> {
    if (createWaitlistDto.trial_count >= 4) {
      throw new MaximumTrialCount();
    }

    if (createWaitlistDto.email.includes("+")) {
      throw new InvalidEmailException();
    }

    const emailDomain = createWaitlistDto.email.split("@")[1];

    if (this.utils.isEmailDisposable(emailDomain)) {
      throw new InvalidEmailException();
    }

    // check if email is a disposable email
    const checkForEmail = await this.waitlistService.doesEmailExist(
      createWaitlistDto.email
    );

    if (checkForEmail) {
      throw new EmailExistsInWaitlist();
    }

    const referralCode = this.utils.generateReferralCode();

    if (createWaitlistDto.referral_code) {
      const getOwnerOfCode = await this.waitlistService.getReferralCodeDetails(
        createWaitlistDto.referral_code
      );

      if (getOwnerOfCode) {
        // create 2 point
        await this.waitlistService.createReferralPoint({
          comment: `${createWaitlistDto.email} joined the waitlist program using your referral link`,
          point: 100,
          waitlistUserId: getOwnerOfCode.id,
          state: "REFERRED_PARTICPATION",
          isPointFromReferral: true,
        });

        // send email to code owner stating what just happened
        this.eventEmitter.emit("send.email.waitlist", {
          emailBody: "text",
          recipientEmail: getOwnerOfCode.email,
          subject: `Exciting News! Your Referral = Bitcoin Points!`,
          recipientName: getOwnerOfCode.email.split("@")[0],
          referredUser: createWaitlistDto.email.split("@")[0],
          emailType: "ReferredUserJoinedWaitlist",
        } as ReferredUserJoinedWithReferralLinkSendEmail);
      }
    }

    const joinWaitlist = await this.waitlistService.create({
      email: createWaitlistDto.email,
      referralCode: referralCode[0],
    });

    this.eventEmitter.emit("send.email.waitlist", {
      emailBody: "text",
      recipientEmail: createWaitlistDto.email,
      subject: `Welcome to Wellat - Your Bitcoin Journey Begins`,
      recipientName: createWaitlistDto.email.split("@")[0],
      emailType: "NewUserJoinedWaitlist",
      referralCode: referralCode,
    } as JoinWaitlistEmail);

    return {
      status: true,
      message: WaitlistStatusMessages.JoinWaitlist.success,
      data: joinWaitlist,
    };
  }

  @Get(":email")
  async findAll(
    @Param("email") email: string
  ): Promise<GetWailistPoinstRespones> {
    return {
      status: true,
      message: WaitlistStatusMessages.JoinWaitlist.ok,
      data: await this.waitlistService.getReferralPoints(email),
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.waitlistService.findOne(+id);
  }

  @Delete(":email")
  async remove(@Param("email") email: string): Promise<JoinWaitlistResponse> {
    await this.waitlistService.remove(email);
    return {
      status: true,
      message: WaitlistStatusMessages.JoinWaitlist.delete,
    };
  }
}
