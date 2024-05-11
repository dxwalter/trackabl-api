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
  HasOne,
} from "sequelize-typescript";

import { UserModel } from "../../user/models/user.model";
import { SubcategoriesModel } from "../../category/model/subcatgories.model";
import { CategoriesModel } from "../../category/model/categories.model";
import { CurrencyModel } from "../model/currencies.model";

@Table({
  tableName: "expenses",
  paranoid: false,
  timestamps: true,
  underscored: false,
})
export class ExpenseModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @ForeignKey(() => UserModel)
  @Unique
  @AllowNull(true)
  @Column(DataType.INTEGER)
  public userId: number;

  @ForeignKey(() => CategoriesModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public categoryId: number;

  @ForeignKey(() => SubcategoriesModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public subcategoryId: number;

  @ForeignKey(() => CurrencyModel)
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public currencyId: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  public amount: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  public receipt: string;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.TEXT)
  public note: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BIGINT)
  public expenseDateInUnixTimestamp: number;

  @AllowNull(false)
  @UpdatedAt
  @Column(DataType.DATE)
  public expenseDate: Date;

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

  @BelongsTo(() => UserModel)
  public customer: UserModel;

  @BelongsTo(() => SubcategoriesModel)
  subcategory: SubcategoriesModel;

  @BelongsTo(() => CategoriesModel)
  category: CategoriesModel;

  @BelongsTo(() => CurrencyModel)
  currency: CurrencyModel;
}
