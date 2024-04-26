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

import { SubscriptionMarketPricesModel } from "./subcription-market-price.model";
import { UserSubscriptionModel } from "./user-subscriptions.model";

@Table({
  tableName: "subscription-plans",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class SubcriptionPlanModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  public name: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public status: boolean;

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

  @HasMany(() => SubscriptionMarketPricesModel, {
    as: "subcriptionMarketPrice",
    onDelete: "cascade",
    hooks: false,
  })
  subcriptionMarketPrice: SubscriptionMarketPricesModel;

  @HasMany(() => UserSubscriptionModel, {
    as: "plan_subscriptions",
    onDelete: "cascade",
    hooks: false,
  })
  plan_subscriptions: UserSubscriptionModel;
}
