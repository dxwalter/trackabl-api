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

@Table({
  tableName: "platform-feature-status",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class PlatformFeatureStatus extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public feature: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  public status: boolean;

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
