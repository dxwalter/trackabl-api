import { ExpenseService } from "../expense.service";
import { Utils } from "../../utils";
import * as dayjs from "dayjs";
import { QueryExpensesDto } from "../dto/query-expense.dto";
import { getExpensesResponse } from "../types/expense.types";
import { fileType } from "../../../types/global.types";
import { ExpenseModel } from "../model/expense.model";
import {
  CategoryRequiredException,
  CategoryNotFoundException,
  SubcategoryNotFoundException,
  SubcategoryRequiredException,
  CurrencyRequiredException,
  CurrencyNotFoundException,
  ExpenseNotFoundException,
} from "../exceptions/expense.exceptions";
import { CategoryService } from "../../category/category.service";
import { ExpenseStatusMessages } from "../config/expense-response-messages";
import { BadRequestException } from "@nestjs/common";

export class QueryExpense {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
    private readonly utils: Utils
  ) {}

  async getExpenses(
    userId: number,
    data: QueryExpensesDto
  ): Promise<getExpensesResponse> {
    const startDate = data.startDate
      ? dayjs(data.startDate)
      : dayjs(data.endDate); // MM/DD/YY - If start date is not defined, set end date as start date
    const endDate = dayjs(data.endDate);

    const startDateInUnix = dayjs(startDate).unix() + 86400;
    const endDateInUnix = dayjs(endDate).unix() + 86400;

    const queryBody = {
      startDateInUnix,
      endDateInUnix,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      userId,
      pageNumber: data.pageNumber,
    };

    let getExpenses: ExpenseModel[] | undefined =
      await this.expenseService.GetExpenses(queryBody);

    let aggreagate:
      | {
          data: any[];
        }
      | undefined = {
      data: [],
    };

    let totalAmount: number | undefined = 0;

    if (data.aggregate) {
      if (data.aggregate.toLowerCase() === "add-expense") {
        for (const el of getExpenses) {
          totalAmount += Number(el.amount);
        }
        getExpenses = undefined;
        aggreagate = undefined;
      }

      if (data.aggregate.toLowerCase() === "category") {
        if (data.categoryId) {
          aggreagate =
            await this.expenseService.aggregateExpensesForCategory(queryBody);
        } else {
          throw new BadRequestException("A category was not selected");
        }
      }

      if (data.aggregate.toLowerCase() === "subcategory") {
        if (data.subcategoryId) {
          aggreagate =
            await this.expenseService.aggregateExpensesForSubcategory(
              queryBody
            );
        } else {
          throw new BadRequestException("A subcategory was not selected");
        }
      }
    }

    return {
      status: true,
      message: ExpenseStatusMessages.default,
      data: {
        aggregation: aggreagate ? aggreagate.data : undefined,
        expense: getExpenses,
        expenseTotal:
          data.aggregate && data.aggregate.toLowerCase() === "add-expense"
            ? totalAmount
            : undefined,
      },
    };
  }

  async aggregateCategoryAmount(
    userId: number,
    data: QueryExpensesDto
  ): Promise<any> {
    const startDate = data.startDate ?? dayjs("01/01/2022"); // MM/DD/YY
    const endDate = dayjs(data.endDate);

    const startDateInUnix = dayjs(startDate).unix();
    const endDateInUnix = dayjs(endDate).unix();

    const aggreagate = await this.expenseService.aggregateExpensesForCategory({
      startDateInUnix,
      endDateInUnix,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      userId,
      pageNumber: data.pageNumber,
    });
  }
}
