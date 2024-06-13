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

import { MarketModel } from "../../subscription/model/market.model";
@Table({
  tableName: "entrypoint",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class EntrypointModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public heroBannerImage: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public mobileHeroBannerImage: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public benefitBannerImage: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public mobileBenefitBannerImage: string;

  @ForeignKey(() => MarketModel)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  public marketId: number;

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
}
