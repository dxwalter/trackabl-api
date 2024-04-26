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
  tableName: "markets",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class MarketModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  public countryName: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  public countryCode: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  public currencyCode: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  public currencyName: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  public currencySymbol: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  public vat: number;

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
    as: "market_price_subscriptions",
    onDelete: "cascade",
    hooks: false,
  })
  market_price_subscriptions: UserSubscriptionModel;
}
