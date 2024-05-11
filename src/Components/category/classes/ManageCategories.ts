import { Utils } from "../../utils";
import { fileType } from "../../../types/global.types";
import { CategoryService } from "../category.service";
import {
  CreateCategoryResponse,
  CategoryDefaultResponse,
} from "../types/category-types";
import { CreateCategoryDto } from "../dto/create-category.dto";
import {
  CategoryExists,
  CategoryDoesNotExist,
  ProvideUserId,
} from "../exceptions/category.exception";
import { CategoryStatusMessages } from "../config/category-response-messages";
export class ManageCategories {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly utils: Utils
  ) {}

  async create(
    req: any,
    data: CreateCategoryDto,
    file: fileType
  ): Promise<CreateCategoryResponse> {
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

    const getCategory =
      await this.categoryService.findCategoryUsingName(newName);

    if (getCategory) {
      throw new CategoryExists();
    }

    if (data.isUserDefinedCategory === true && !data.userId) {
      throw new ProvideUserId();
    }

    // move file to cloudinary
    const fileUrl = await this.utils.uploadImageToCloudinary({
      imagePath: file.path,
      asset_folder: "/trackabl/category_icons",
    });

    return {
      message: CategoryStatusMessages.Create.success,
      status: true,
      data: await this.categoryService.createCategory({
        color: data.color,
        icon: fileUrl,
        isCategoryActive: data.setActive,
        isUserDefinedCategory: data.isUserDefinedCategory,
        name: data.name,
        userId: data.userId ? data.userId : null,
      }),
    };
  }

  async updateCategoryActiveStatus(
    id: number
  ): Promise<CategoryDefaultResponse> {
    const getCategory = await this.categoryService.findCategoryUsingId(id);

    if (!getCategory) {
      throw new CategoryDoesNotExist();
    }

    await this.categoryService.updateCategory(id, {
      isCategoryActive: !getCategory.isCategoryActive,
    });

    return {
      status: true,
      message: CategoryStatusMessages.Update.success,
    };
  }
}
