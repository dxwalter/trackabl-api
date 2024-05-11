import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExpenseService } from "./expense.service";
import { ExpenseController } from "./expense.controller";
import { ExpenseModel } from "./model/expense.model";
import { CurrencyModel } from "./model/currencies.model";
import { Utils } from "../utils";
import { CategoryService } from "../category/category.service";
import { CategoriesModel } from "../category/model/categories.model";
import { SubcategoriesModel } from "../category/model/subcatgories.model";
import { SuggestedCategoriesModel } from "../category/model/suggested-categories.model";
import { SuggestedSubcategoriesModel } from "../category/model/suggested-subcatgories.model";

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, Utils, CategoryService],
  imports: [
    SequelizeModule.forFeature([
      ExpenseModel,
      CurrencyModel,
      CategoriesModel,
      SubcategoriesModel,
      SuggestedCategoriesModel,
      SuggestedSubcategoriesModel,
    ]),
  ],
})
export class ExpenseModule {}
