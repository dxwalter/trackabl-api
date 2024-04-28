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
} from "sequelize-typescript";

import { UserModel } from "../../user/models/user.model";

@Table({
  tableName: "categories",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class CategoriesModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public name: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isUserDefinedCategory: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isCategoryActive: boolean;

  @ForeignKey(() => UserModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public userId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  public icon: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public color: string;

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
