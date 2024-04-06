// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { Op } = require('sequelize');
import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { WaitlistUser } from "./models/waitlist-user.model";
import { WaitlistUsersPoint } from "./models/waitlist-referral-point.model";
import { CreateNewuser, CreateReferralPoint } from "./types/waitlist.types";

@Injectable()
export class WaitlistService {
  constructor(
    @InjectModel(WaitlistUser)
    private readonly waitlistModel: typeof WaitlistUser,
    @InjectModel(WaitlistUsersPoint)
    private readonly waitlistPointModel: typeof WaitlistUsersPoint
  ) {}

  async create(createWaitlistDto: CreateNewuser): Promise<WaitlistUser> {
    try {
      const makeRequest = await this.waitlistModel.create({
        ...createWaitlistDto,
      });

      // create 3 point
      await this.createReferralPoint({
        comment: "You joined the wailist program",
        point: 100,
        waitlistUserId: makeRequest.id,
        state: "INITIAL_PARTICIPATION",
        isPointFromReferral: false,
      });

      // send email to user for signing up

      return makeRequest;
    } catch (error) {
      throw new BadRequestException(
        "An error occurred joining the wailist program"
      );
    }
  }

  async createReferralPoint(
    createReferralPoint: CreateReferralPoint
  ): Promise<void> {
    try {
      await this.waitlistPointModel.create({
        ...createReferralPoint,
      });
    } catch (error) {
      throw new BadRequestException("An error occurred creating your point");
    }
  }

  async getReferralCodeDetails(
    referralCode: string
  ): Promise<WaitlistUser | null> {
    try {
      const makeRequest: WaitlistUser | null = await this.waitlistModel.findOne(
        {
          where: {
            referralCode,
          },
        }
      );

      return makeRequest;
    } catch (error) {
      throw new BadRequestException(
        "An error occurred validating the referral code you provided"
      );
    }
  }

  findAll() {
    return `This action returns all waitlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waitlist`;
  }

  async remove(email: string): Promise<void> {
    try {
      await this.waitlistModel.destroy({
        where: { email },
        limit: 1,
      });
    } catch (error) {
      throw new BadRequestException(
        "An error occurred deleting your subscription"
      );
    }
  }

  async doesEmailExist(email: string): Promise<boolean> {
    try {
      const getUser: WaitlistUser | null = await this.waitlistModel.findOne({
        where: {
          email,
        },
      });

      if (getUser) return true;

      return false;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        "An error occurred completing this request"
      );
    }
  }

  async getReferralPoints(email: string): Promise<WaitlistUser> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryParams: any = {
        where: {
          email: email,
        },
        include: {
          model: WaitlistUsersPoint,
          as: "user_waitlist_points",
        },
      };

      return await this.waitlistModel.findOne(queryParams);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        "An error occurred getting your referral points"
      );
    }
  }
}
