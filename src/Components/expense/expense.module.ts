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

import { UserService } from "../user/user.service";
import { UserSignUpPoints } from "../user/models/user-sign-up-points.model";
import { UserModel } from "../user/models/user.model";
import { UserSubscriptionModel } from "../subscription/model/user-subscriptions.model";

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, Utils, CategoryService, UserService],
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      ExpenseModel,
      CurrencyModel,
      CategoriesModel,
      UserSignUpPoints,
      SubcategoriesModel,
      UserSubscriptionModel,
      SuggestedCategoriesModel,
      SuggestedSubcategoriesModel,
    ]),
  ],
})
export class ExpenseModule {}
