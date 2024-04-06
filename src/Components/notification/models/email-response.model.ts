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
} from "sequelize-typescript";

@Table({
  tableName: "email-response",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class EmailResponses extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public receiver: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  public data: JSON;

  @AllowNull(false)
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
