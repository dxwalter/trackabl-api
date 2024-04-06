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
} from "sequelize-typescript";

import { WaitlistUsersPoint } from "./waitlist-referral-point.model";

@Table({
  tableName: 'waitlist-users"',
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class WaitlistUser extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public email: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public referralCode: string;

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

  @HasMany(() => WaitlistUsersPoint, {
    as: "user_waitlist_points",
    onDelete: "cascade",
    hooks: true,
  })
  user_waitlist_points: WaitlistUsersPoint;
}
