import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  DeletedAt,
  HasMany,
  Default,
} from "sequelize-typescript";

import { UserSignUpPoints } from "./user-sign-up-points.model";
import { USER_TYPE } from "../types/user.contants";
import { UserSubscriptionModel } from "../../subscription/model/user-subscriptions.model";

@Table({
  tableName: "users",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class UserModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public firstName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public lastName: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public password: string;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING)
  public referralCode: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isEmailVerified: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isSubscriptionActive: boolean;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.INTEGER)
  public activeSubscriptionId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public emailVerificationCode: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  public passwordRecoveryCode: string;

  @AllowNull(false)
  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @AllowNull(true)
  @CreatedAt
  @Column(DataType.DATE)
  public acceptedTCAndPP: Date;

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @AllowNull(true)
  @DeletedAt
  @Column(DataType.DATE)
  public deletedAt: Date;

  @HasMany(() => UserSignUpPoints, {
    as: "user_sign_up_points",
    onDelete: "cascade",
    hooks: true,
  })
  user_sign_up_points: UserSignUpPoints;

  @HasMany(() => UserSubscriptionModel, {
    as: "user_subscriptions",
    onDelete: "cascade",
    hooks: true,
  })
  user_subscriptions: UserSubscriptionModel;
}
