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
  Comment,
} from "sequelize-typescript";

import { ErrorSeverity } from "../types/error-logs.constants";

const severity = [ErrorSeverity.HIGH, ErrorSeverity.LOW, ErrorSeverity.MEDIUM];

@Table({
  tableName: "system-error-log",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class SystemErrorLogs extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public application: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...severity))
  public severity: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  public statusCode: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public message: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  public details: JSON;

  @AllowNull(true)
  @Default(false)
  @Comment("This field represents if this error has been resolved")
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
}
