import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";

import { CategoriesModel } from "./model/categories.model";
import { SuggestedCategoriesModel } from "./model/suggested-categories.model";
import { SubcategoriesModel } from "./model/subcatgories.model";
import { SuggestedSubcategoriesModel } from "./model/suggested-subcatgories.model";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    SequelizeModule.forFeature([
      CategoriesModel,
      SuggestedCategoriesModel,
      SubcategoriesModel,
      SuggestedSubcategoriesModel,
    ]),
  ],
})
export class CategoryModule {}
