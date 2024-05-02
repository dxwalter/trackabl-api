import { Utils } from "../../utils";
import { fileType } from "../../../types/global.types";
import { CategoryService } from "../category.service";
import { CreateSubcategoryResponse } from "../types/category-types";
import { CreateSubcategoryDto } from "../dto/create-category.dto";
import {
  SubcategoryExists,
  CategoryDoesNotExist,
} from "../exceptions/category.exception";
import { CategoryStatusMessages } from "../config/category-response-messages";
export class ManageSubcategories {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly utils: Utils
  ) {}

  async createSubcategory(
    categoryId: number,
    data: CreateSubcategoryDto
  ): Promise<CreateSubcategoryResponse> {
    const nameList = data.name.split(" ");

    let newName = "";

    if (nameList.length > 1) {
      newName =
        this.utils.capitalizeWord(nameList[0]) +
        " " +
        this.utils.capitalizeWord(nameList[1]);
    } else {
      newName = this.utils.capitalizeWord(data.name);
    }

    const getSubcategory =
      await this.categoryService.findSubcategoryUsingNameAndId(
        newName,
        categoryId
      );

    if (getSubcategory) {
      throw new SubcategoryExists();
    }

    return {
      status: true,
      message: CategoryStatusMessages.Subcategory.success,
      data: await this.categoryService.createSubcategory({
        categoryId,
        color: data.color,
        isSubcategoryActive: data.isSubcategoryActive,
        isUserDefinedSubcategory: data.isUserDefinedSubcategory,
        name: data.name,
        userId: data.userId,
      }),
    };
  }
}
