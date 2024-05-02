import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";
import { CategoryService } from "./category.service";
import { SuggestedCategoryService } from "./category.suggestions.service";
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  CreateUserSuggestedCategoryDto,
  CreateUserSuggestedSubCategoryDto,
} from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AdminRoles } from "../../Config/adminRole/admin.roles.decortator";
import { AdminRole } from "../../Config/adminRole/enums/admin.roles";
import { RolesGuard } from "../../Config/roles.guard";
import { AuthGuard } from "../user/guard/auth.guard";
import {
  CreateCategoryResponse,
  CategoryDefaultResponse,
  CreateSubcategoryResponse,
  ListCategoriesForAdminResponse,
  ListSuggestedCategoriesForAdminResponse,
  CreateSuggestedCategoryResponse,
  CreateSuggestedSubcategoryResponse,
  ListSuggestedSubcategoriesForAdminResponse,
} from "./types/category-types";
import { CategoryStatusMessages } from "./config/category-response-messages";
import { Utils } from "../utils";
import { ManageCategories } from "./classes/ManageCategories";
import { ManageSubcategories } from "./classes/ManageSubcategories";
import { ManageSuggestedCategories } from "./classes/SuggestedCategories";

@Controller("category")
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly suggestedCategoryService: SuggestedCategoryService,
    private readonly utils: Utils
  ) {}

  @UseInterceptors(FileInterceptor("icon"))
  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("/create-category")
  async createCategory(
    @Request() req: any,
    @Body() data: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 30000,
            message: "Category icon cannot be more than 30kb",
          }),
          new FileTypeValidator({
            fileType: "image/svg",
          }),
        ],
      })
    )
    file: Express.Multer.File
  ): Promise<CreateCategoryResponse> {
    return await new ManageCategories(this.categoryService, this.utils).create(
      req,
      data,
      file
    );
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("/create-subcategory/:id")
  async createSubcategory(
    @Request() req: any,
    @Body() data: CreateSubcategoryDto,
    @Param("id") id: number
  ): Promise<CreateSubcategoryResponse> {
    return await new ManageSubcategories(
      this.categoryService,
      this.utils
    ).createSubcategory(id, data);
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get("/admin-get-category")
  async getCategoriesForAdmin(): Promise<ListCategoriesForAdminResponse> {
    return {
      status: true,
      message: CategoryStatusMessages.default,
      data: await this.categoryService.getAllCategoriesForAdmin(),
    };
  }

  @UseGuards(AuthGuard)
  @Get("/")
  async getCategoriesForCustomer(
    @Request() req: any
  ): Promise<ListCategoriesForAdminResponse> {
    return {
      status: true,
      message: CategoryStatusMessages.default,
      data: await this.categoryService.getAllCategoriesForCustomer(req.user.id),
    };
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch("/active-status/:id")
  async changeCategoryActiveStatus(
    @Param("id") id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryDefaultResponse> {
    return await new ManageCategories(
      this.categoryService,
      this.utils
    ).updateCategoryActiveStatus(id);
  }

  // User suggests category
  @UseGuards(AuthGuard)
  @Post("/suggestion")
  async createUserSuggestedCategory(
    @Request() req: any,
    @Body() data: CreateUserSuggestedCategoryDto
  ): Promise<CreateSuggestedCategoryResponse> {
    return await new ManageSuggestedCategories(
      this.categoryService,
      this.suggestedCategoryService,
      this.utils
    ).createCategory(req.user.id, data);
  }

  // User suggests subcategory
  @UseGuards(AuthGuard)
  @Post("/subcategory-suggestion")
  async createUserSuggestedSubcategory(
    @Request() req: any,
    @Body() data: CreateUserSuggestedSubCategoryDto
  ): Promise<CreateSuggestedSubcategoryResponse> {
    return await new ManageSuggestedCategories(
      this.categoryService,
      this.suggestedCategoryService,
      this.utils
    ).createSubcategory(req.user.id, data);
  }

  // Admin gets suggested category

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get("/suggestion")
  async GetUserSuggestedCategory(): Promise<ListSuggestedCategoriesForAdminResponse> {
    return {
      status: true,
      message: CategoryStatusMessages.default,
      data: await this.suggestedCategoryService.getAllSuggestedCategories(),
    };
  }

  // Admin gets suggested subcategory

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get("/subcategory-suggestion")
  async GetUserSuggestedSubcategory(): Promise<ListSuggestedSubcategoriesForAdminResponse> {
    return {
      status: true,
      message: CategoryStatusMessages.default,
      data: await this.suggestedCategoryService.getAllSuggestedSubcategories(),
    };
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete("/suggestion/:id")
  async DeleteSuggestedCategory(
    @Param("id") id: number
  ): Promise<CategoryDefaultResponse> {
    await this.suggestedCategoryService.deleteSuggestedCategory(id);
    return {
      status: true,
      message: CategoryStatusMessages.Suggestions.category.delete,
    };
  }

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete("/subcategory-suggestion/:id")
  async DeleteSuggestedSubcategory(
    @Param("id") id: number
  ): Promise<CategoryDefaultResponse> {
    await this.suggestedCategoryService.deleteSuggestedSubcategory(id);
    return {
      status: true,
      message: CategoryStatusMessages.Suggestions.subcategory.delete,
    };
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
