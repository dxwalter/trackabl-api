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
  ForeignKey,
  Default,
  HasOne,
  Comment,
  BelongsTo,
} from "sequelize-typescript";

import { UserModel } from "../../user/models/user.model";
import { SystemTokenModel } from "./system-tokens.model";
import { TokenWalletHistory } from "../../history/models/token-wallet-history";

@Table({
  tableName: "temporary-remittance",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class TemporaryRemittanceModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @ForeignKey(() => UserModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public userId: number;

  @ForeignKey(() => SystemTokenModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public systemTokenId: number;

  @AllowNull(true)
  @Comment("This field represents id of the transaction on the history table")
  @Column(DataType.INTEGER)
  public historyId: number;

  @AllowNull(false)
  @Comment("This field represents id of the wallet from Binance")
  @Column(DataType.STRING)
  public binanceTemporalWalletID: string;

  @AllowNull(true)
  @Column(DataType.DOUBLE)
  public amount: number;

  @AllowNull(true)
  @Default(false)
  @Comment("This field represents if the user has successfully sent the funds")
  @Column(DataType.BOOLEAN)
  public recipientStatus: boolean;

  @AllowNull(true)
  @Default(false)
  @Comment(
    "This field represents if the system has successfully moved the funds from temporal account to base account"
  )
  @Column(DataType.BOOLEAN)
  public baseDeploymentStatus: boolean;

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

  @HasMany(() => TokenWalletHistory, {
    as: "token_wallet_history",
    onDelete: "cascade",
    hooks: false,
  })
  tokenWalletHistory: TokenWalletHistory;
}
