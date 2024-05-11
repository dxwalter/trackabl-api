import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesModel } from "./model/categories.model";
import { SubcategoriesModel } from "./model/subcatgories.model";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { UserModel } from "../user/models/user.model";
import {
  CreateCategoryType,
  UpdateCategory,
  CreateSubcategoryType,
} from "./types/category-types";
import { Op } from "sequelize";
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoriesModel)
    private readonly category: typeof CategoriesModel,
    @InjectModel(SubcategoriesModel)
    private readonly subcategory: typeof SubcategoriesModel,
    protected eventEmitter: EventEmitter2
  ) {}

  async getAllCategoriesForAdmin(): Promise<CategoriesModel[]> {
    try {
      return await this.category.findAll({
        include: [
          {
            model: SubcategoriesModel,
            include: [
              {
                model: UserModel,
              },
            ],
          },
          {
            model: UserModel,
          },
        ],
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting categories for admin`,
        severity: "HIGH",
        details: {
          service: "CategoryService.getAllCategoriesForAdmin",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred getting categories for admin"
      );
    }
  }

  async getAllCategoriesForCustomer(
    userId: number
  ): Promise<CategoriesModel[]> {
    try {
      return await this.category.findAll({
        where: {
          isCategoryActive: true,
        },
        include: [
          {
            where: {
              [Op.or]: [{ userId: null }, { userId }],
            },
            model: SubcategoriesModel,
            attributes: {
              exclude: [
                "userId",
                "isSubcategoryActive",
                "customer",
                "isUserDefinedSubcategory",
              ],
            },
          },
        ],
        attributes: {
          exclude: [
            "userId",
            "isUserDefinedCategory",
            "customer",
            "isCategoryActive",
          ],
        },
      });
    } catch (error) {
      console.log(error);
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting categories for admin`,
        severity: "HIGH",
        details: {
          service: "CategoryService.getAllCategoriesForAdmin",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred getting categories for admin"
      );
    }
  }

  async createCategory(data: CreateCategoryType): Promise<CategoriesModel> {
    try {
      return await this.category.create({
        ...data,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error occurred creating category`,
        severity: "HIGH",
        details: {
          service: "CategoryService.createCategory",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred creating your category");
    }
  }

  async findCategoryUsingName(name: string): Promise<CategoriesModel | null> {
    try {
      return await this.category.findOne({
        where: {
          name,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking if category exists: ${name}`,
        severity: "MEDIUM",
        details: {
          service: "CategoryService.findCategoryUsingName",
          payload: name,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred checking if category exists"
      );
    }
  }

  async findCategoryUsingId(id: number): Promise<CategoriesModel | null> {
    try {
      return await this.category.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking if category exists: ${id}`,
        severity: "MEDIUM",
        details: {
          service: "CategoryService.findCategoryUsingId",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting category");
    }
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategory
  ): Promise<number[]> {
    try {
      return await this.category.update(
        { ...updateCategoryDto },
        {
          where: { id },
        }
      );
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error updating category: ${id}`,
        severity: "MEDIUM",
        details: {
          service: "CategoryService.updateCategory",
          payload: {
            id,
            ...updateCategoryDto,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting category");
    }
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async findSubcategoryUsingNameAndCategoryId(
    name: string,
    categoryId: number
  ): Promise<SubcategoriesModel | null> {
    try {
      return await this.subcategory.findOne({
        where: {
          [Op.and]: [{ categoryId }, { name }],
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking if subcategory exists: ${name}`,
        severity: "MEDIUM",
        details: {
          service: "CategoryService.findSubcategoryUsingNameAndId",
          payload: { name, categoryId },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred checking if subcategory exists"
      );
    }
  }

  async findSubcategoryUsingId(id: number): Promise<SubcategoriesModel | null> {
    try {
      return await this.subcategory.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error checking if subcategory exists: ${id}`,
        severity: "MEDIUM",
        details: {
          service: "CategoryService.findSubcategoryUsingId",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException(
        "An error occurred checking if subcategory exists"
      );
    }
  }

  async createSubcategory(
    data: CreateSubcategoryType
  ): Promise<SubcategoriesModel> {
    try {
      return await this.subcategory.create({
        ...data,
      });
    } catch (error) {
      console.log(error.message);
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error occurred creating subcategory`,
        severity: "HIGH",
        details: {
          service: "CategoryService.createSubcategory",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred creating subcategory");
    }
  }
}
