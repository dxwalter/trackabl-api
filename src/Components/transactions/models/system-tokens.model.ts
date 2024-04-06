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
import { TemporaryRemittanceModel } from "./temporary-remittances.model";

@Table({
  tableName: "system-tokens",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class SystemTokenModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public systemTokenId: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public name: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public icon: string;

  @AllowNull(false)
  @Column(DataType.DOUBLE)
  public minimumDepositAmount: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public address: string;

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

  @HasMany(() => TemporaryRemittanceModel, {
    as: "temporalRemittances",
    onDelete: "cascade",
    hooks: false,
  })
  temporalRemittances: TemporaryRemittanceModel;
}
