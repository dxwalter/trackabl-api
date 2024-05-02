import { Utils } from "../../utils";
import { fileType } from "../../../types/global.types";
import { CategoryService } from "../category.service";
import { SuggestedCategoryService } from "../category.suggestions.service";
import {
  CreateCategoryResponse,
  CategoryDefaultResponse,
  CreateSuggestedCategoryResponse,
  CreateSuggestedSubcategoryResponse,
} from "../types/category-types";
import {
  CreateCategoryDto,
  CreateUserSuggestedCategoryDto,
  CreateUserSuggestedSubCategoryDto,
} from "../dto/create-category.dto";
import {
  CategoryExists,
  CategoryDoesNotExist,
  ProvideUserId,
} from "../exceptions/category.exception";
import { CategoryStatusMessages } from "../config/category-response-messages";
export class ManageSuggestedCategories {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly suggestedCategoryService: SuggestedCategoryService,
    private readonly utils: Utils
  ) {}

  async createCategory(
    userId: number,
    data: CreateUserSuggestedCategoryDto
  ): Promise<CreateSuggestedCategoryResponse> {
    return {
      status: true,
      message: CategoryStatusMessages.Suggestions.category.create,
      data: await this.suggestedCategoryService.createSuggestedCategory({
        name: data.name,
        userId,
        description: data.description,
      }),
    };
  }

  async createSubcategory(
    userId: number,
    data: CreateUserSuggestedSubCategoryDto
  ): Promise<CreateSuggestedSubcategoryResponse> {
    return {
      status: true,
      message: data.isPublic
        ? CategoryStatusMessages.Suggestions.subcategory.create
        : CategoryStatusMessages.Subcategory.success,
      data: data.isPublic
        ? await this.suggestedCategoryService.createSuggestedSubcategory({
            categoryId: data.categoryId,
            name: data.name,
            userId,
            description: data.description,
          })
        : await this.categoryService.createSubcategory({
            categoryId: data.categoryId,
            color: this.utils.generateRandomColor(),
            isSubcategoryActive: true,
            isUserDefinedSubcategory: true,
            name: data.name,
            userId,
          }),
    };
  }
}
