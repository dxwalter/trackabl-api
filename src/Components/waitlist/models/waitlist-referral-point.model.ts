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

import { WaitlistUser } from "./waitlist-user.model";

@Table({
  tableName: "waitlist-points",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class WaitlistUsersPoint extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @ForeignKey(() => WaitlistUser)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public waitlistUserId: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  public point: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public comment: string;

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
