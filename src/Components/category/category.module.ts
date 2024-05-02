import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CategoryService } from "./category.service";
import { SuggestedCategoryService } from "./category.suggestions.service";
import { CategoryController } from "./category.controller";

import { CategoriesModel } from "./model/categories.model";
import { SuggestedCategoriesModel } from "./model/suggested-categories.model";
import { SubcategoriesModel } from "./model/subcatgories.model";
import { SuggestedSubcategoriesModel } from "./model/suggested-subcatgories.model";

import { UserModel } from "../user/models/user.model";

import { Utils } from "../utils";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, Utils, SuggestedCategoryService],
  imports: [
    SequelizeModule.forFeature([
      CategoriesModel,
      SuggestedCategoriesModel,
      SubcategoriesModel,
      SuggestedSubcategoriesModel,
      UserModel,
    ]),
  ],
})
export class CategoryModule {}
