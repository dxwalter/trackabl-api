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

import { SystemTokenModel } from "../../transactions/models/system-tokens.model";
import { TemporaryRemittanceModel } from "../../transactions/models/temporary-remittances.model";
import { UserModel } from "../../user/models/user.model";

import { TRANSACTION_TYPE } from "../types/history.constant";

const listTransactionTypes = [
  TRANSACTION_TYPE.DEPOSIT,
  TRANSACTION_TYPE.WITHDRAWAL,
];

@Table({
  tableName: "token-wallet-history",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class TokenWalletHistory extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @ForeignKey(() => SystemTokenModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public systemTokenId: number;

  @ForeignKey(() => TemporaryRemittanceModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public temporalRemittanceId: number;

  @ForeignKey(() => UserModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public userId: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  public previousWalletId: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...listTransactionTypes))
  public transactionType: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public tokenName: string;

  @AllowNull(false)
  @Column(DataType.DOUBLE)
  public amount: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public balance: number;

  @AllowNull(true)
  @Column(DataType.JSONB)
  public previousTransactionData: JSON;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  public createdAtInUnixTimestamp: number;

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

  @BelongsTo(() => SystemTokenModel)
  public systemToken: SystemTokenModel;

  @BelongsTo(() => UserModel)
  public user: UserModel;

  @BelongsTo(() => TemporaryRemittanceModel)
  public temporalRemittances: TemporaryRemittanceModel;
}
