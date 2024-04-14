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

import { MarketModel } from "./market.model";
import { SubcriptionPlanModel } from "./subscription-plans.model";

@Table({
  tableName: "subscription-market-prices",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class SubscriptionMarketPricesModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @ForeignKey(() => SubcriptionPlanModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public planId: number;

  @ForeignKey(() => MarketModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public marketId: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public freePlanPriceInDays: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  public price: number;

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

  @BelongsTo(() => MarketModel)
  public market: MarketModel;

  @BelongsTo(() => SubcriptionPlanModel)
  public subscriptionPlan: SubcriptionPlanModel;
}
