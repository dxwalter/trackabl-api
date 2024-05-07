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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import { SubscriptionMarketPricesModel } from "./subcription-market-price.model";
import { SubcriptionPlanModel } from "./subscription-plans.model";
import { MarketModel } from "./market.model";
import { UserModel } from "../../user/models/user.model";

@Table({
  tableName: "user-subscriptions",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class UserSubscriptionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isActive: boolean;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public userId: number;

  @ForeignKey(() => SubcriptionPlanModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public planId: number;

  @ForeignKey(() => MarketModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public marketId: number;

  @ForeignKey(() => SubscriptionMarketPricesModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public priceMarketId: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  public startDateInUnix: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  public reference: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public endDateInUnix: number;

  @AllowNull(true)
  @CreatedAt
  @Column(DataType.DATE)
  public startDate: Date;

  @AllowNull(true)
  @CreatedAt
  @Column(DataType.DATE)
  public endDate: Date;

  @AllowNull(true)
  @Column(DataType.JSONB)
  public paymentDetails: any;

  @AllowNull(true)
  @Column(DataType.JSONB)
  public paymentProviderDetails: any;

  @AllowNull(false)
  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @AllowNull(true)
  @DeletedAt
  @Column(DataType.DATE)
  public deletedAt: Date;

  @BelongsTo(() => UserModel)
  public user: UserModel;

  @BelongsTo(() => MarketModel)
  public market: MarketModel;

  @BelongsTo(() => SubcriptionPlanModel)
  public plan: SubcriptionPlanModel;

  @BelongsTo(() => SubscriptionMarketPricesModel)
  public price: SubscriptionMarketPricesModel;
}
