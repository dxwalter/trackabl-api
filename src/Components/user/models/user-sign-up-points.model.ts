import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  DeletedAt,
  Default,
} from "sequelize-typescript";

import { UserModel } from "./user.model";

@Table({
  tableName: "sign-up-points",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class UserSignUpPoints extends Model {
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

  @AllowNull(false)
  @Column(DataType.NUMBER)
  public point: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public comment: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public state: string;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isPointFromReferral: boolean;

  @AllowNull(true)
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
}
