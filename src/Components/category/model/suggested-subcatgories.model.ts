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
  BelongsTo,
} from "sequelize-typescript";

import { UserModel } from "../../user/models/user.model";
import { CategoriesModel } from "./categories.model";

@Table({
  tableName: "suggested-subcategories",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class SuggestedSubcategoriesModel extends Model {
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
  @Column(DataType.TEXT)
  public description: string;

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

  @BelongsTo(() => CategoriesModel)
  public category: CategoriesModel;

  @BelongsTo(() => UserModel)
  public customer: UserModel;
}
