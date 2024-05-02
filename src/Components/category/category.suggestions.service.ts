import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesModel } from "./model/categories.model";
import { SuggestedCategoriesModel } from "./model/suggested-categories.model";
import { SuggestedSubcategoriesModel } from "./model/suggested-subcatgories.model";
import { SubcategoriesModel } from "./model/subcatgories.model";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { UserModel } from "../user/models/user.model";
import {
  CreateCategoryType,
  UpdateCategory,
  CreateSubcategoryType,
  CreateSuggestedCategory,
  CreateSuggestedSubcategory,
} from "./types/category-types";
import { Op } from "sequelize";
@Injectable()
export class SuggestedCategoryService {
  constructor(
    @InjectModel(CategoriesModel)
    private readonly category: typeof CategoriesModel,
    @InjectModel(SubcategoriesModel)
    private readonly subcategory: typeof SubcategoriesModel,
    @InjectModel(SuggestedCategoriesModel)
    private readonly suggestedCategories: typeof SuggestedCategoriesModel,
    @InjectModel(SuggestedSubcategoriesModel)
    private readonly suggestedSubcategories: typeof SuggestedSubcategoriesModel,
    protected eventEmitter: EventEmitter2
  ) {}

  async createSuggestedCategory(
    data: CreateSuggestedCategory
  ): Promise<SuggestedCategoriesModel> {
    try {
      return await this.suggestedCategories.create({
        ...data,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred storing your suggested category`,
        severity: "HIGH",
        details: {
          service: "SuggestedCategoryService.createSuggestedCategory",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred storing your suggested category"
      );
    }
  }

  async createSuggestedSubcategory(
    data: CreateSuggestedSubcategory
  ): Promise<SuggestedSubcategoriesModel> {
    try {
      return await this.suggestedSubcategories.create({
        ...data,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred storing your suggested category`,
        severity: "HIGH",
        details: {
          service: "SuggestedCategoryService.createSuggestedSubcategory",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred storing your suggested subcategory"
      );
    }
  }

  async getAllSuggestedCategories(): Promise<SuggestedCategoriesModel[]> {
    try {
      return await this.suggestedCategories.findAll({
        include: [
          {
            model: UserModel,
          },
        ],
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting all suggested category`,
        severity: "HIGH",
        details: {
          service: "SuggestedCategoryService.getAllSuggestedCategories",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred getting all suggested category"
      );
    }
  }

  async getAllSuggestedSubcategories(): Promise<SuggestedSubcategoriesModel[]> {
    try {
      return await this.suggestedSubcategories.findAll({
        include: [
          {
            model: UserModel,
          },
          {
            model: CategoriesModel,
          },
        ],
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting all suggested category`,
        severity: "HIGH",
        details: {
          service: "SuggestedCategoryService.getAllSuggestedSubcategories",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred getting all suggested categories"
      );
    }
  }

  async deleteSuggestedCategory(id: number): Promise<void> {
    try {
      await this.suggestedCategories.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred deleting suggested category`,
        severity: "HIGH",
        details: {
          service: "SuggestedCategoryService.deleteSuggestedCategory",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred deleting suggested category"
      );
    }
  }

  async deleteSuggestedSubcategory(id: number): Promise<void> {
    try {
      await this.suggestedSubcategories.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred deleting suggested category`,
        severity: "HIGH",
        details: {
          service: "SuggestedCategoryService.deleteSuggestedSubcategory",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred deleting suggested category"
      );
    }
  }
}
