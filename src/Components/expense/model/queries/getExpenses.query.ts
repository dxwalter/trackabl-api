import * as dayjs from "dayjs";
import { BadRequestException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../../../globals/types/globel.types";
import { Op, Sequelize } from "sequelize";

import { ExpenseModel } from "../expense.model";
import { CurrencyModel } from "../currencies.model";
import { CategoriesModel } from "../../../category/model/categories.model";
import { SubcategoriesModel } from "../../../category/model/subcatgories.model";

export interface getExpenseSqlQueryInterface {
  startDateInUnix: number;
  endDateInUnix: number;
  categoryId?: number;
  subcategoryId?: number;
  userId: number;
  pageNumber: number;
}

type categoryAggregate = {
  category_name: string;
  category_color: string;
  category_icon: string;
  total_expense: number;
};

type subcategoryAggregate = {
  subcategory_name: string;
  subcategory_color: string;
  total_expense: number;
};

export interface AggregateExpenseByCategoryOrSubcategory {
  status: boolean;
  data: any;
}

export class ExpenseSqlQuery {
  constructor(
    private readonly expenseModel: typeof ExpenseModel,
    protected eventEmitter: EventEmitter2
  ) {}

  formatQuery(data: getExpenseSqlQueryInterface): any {
    const queryData = {
      userId: data.userId,
      expenseDateInUnixTimestamp: {
        [Op.gte]: data.startDateInUnix,
        [Op.lte]: data.endDateInUnix,
      },
    };

    if (data.categoryId) {
      queryData["categoryId"] = data.categoryId;
    }

    if (data.subcategoryId) {
      queryData["subcategoryId"] = data.subcategoryId;
    }

    return queryData;
  }

  async getExpensesInChronologicalOrder(
    data: getExpenseSqlQueryInterface
  ): Promise<ExpenseModel[]> {
    const limit = 15;

    const offset = data.pageNumber === 1 ? 0 : (data.pageNumber - 1) * limit;

    try {
      return await this.expenseModel.findAll({
        where: this.formatQuery(data),
        limit,
        order: [["id", "DESC"]],
        offset,
        include: [
          {
            model: CurrencyModel,
          },
          {
            model: CategoriesModel,
            attributes: {
              exclude: [
                "userId",
                "isUserDefinedCategory",
                "customer",
                "isCategoryActive",
              ],
            },
          },
          {
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
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting expenses`,
        severity: "HIGH",
        details: {
          service: "ExpenseSqlQuery.getExpensesInChronologicalOrder",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting your expense");
    }
  }

  async aggregateCategoryExpense(
    data: getExpenseSqlQueryInterface
  ): Promise<AggregateExpenseByCategoryOrSubcategory> {
    try {
      const result = await this.expenseModel.findAll({
        where: this.formatQuery(data),
        attributes: [
          "category.id",
          [Sequelize.col("category.name"), "category_name"],
          [Sequelize.col("category.color"), "category_color"],
          [Sequelize.col("category.icon"), "category_icon"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_expense"],
        ],
        include: [
          {
            model: CategoriesModel,
            as: "category",
            attributes: [],
          },
        ],
        group: ["category.id", "category.name"],
      });

      return {
        status: true,
        data: result,
      };
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred aggregating your expenses by category`,
        severity: "HIGH",
        details: {
          service: "ExpenseSqlQuery.aggregateCategoryExpense",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      return {
        status: false,
        data: [],
      };
    }
  }

  async aggregateSubcategoryExpense(
    data: getExpenseSqlQueryInterface
  ): Promise<AggregateExpenseByCategoryOrSubcategory> {
    try {
      const result = await this.expenseModel.findAll({
        where: this.formatQuery(data),
        attributes: [
          "subcategory.id",
          [Sequelize.col("subcategory.name"), "subcategory_name"],
          [Sequelize.col("subcategory.color"), "subcategory_color"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_expense"],
        ],
        include: [
          {
            model: SubcategoriesModel,
            as: "subcategory",
            attributes: [],
          },
        ],
        group: ["subcategory.id", "subcategory.name"],
      });

      return {
        status: true,
        data: result,
      };
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred aggregating your expenses by subcategory`,
        severity: "HIGH",
        details: {
          service: "ExpenseSqlQuery.aggregateCategoryExpense",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      return {
        status: false,
        data: [],
      };
    }
  }
}
