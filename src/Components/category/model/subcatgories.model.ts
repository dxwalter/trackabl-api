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
import { CategoriesModel } from "./categories.model";

@Table({
  tableName: "subcategories",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class SubcategoriesModel extends Model {
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
  public isUserDefinedSubcategory: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public isSubcategoryActive: boolean;

  @ForeignKey(() => CategoriesModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public categoryId: number;

  @ForeignKey(() => UserModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public userId: number;

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
