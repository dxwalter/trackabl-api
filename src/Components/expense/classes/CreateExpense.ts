import { ExpenseService } from "../expense.service";
import { Utils } from "../../utils";
import { CreateExpenseDto } from "../dto/create-expense.dto";
import { createExpenseResponse } from "../types/expense.types";
import { fileType } from "../../../types/global.types";
import {
  CategoryRequiredException,
  CategoryNotFoundException,
  SubcategoryNotFoundException,
  SubcategoryRequiredException,
  CurrencyRequiredException,
  CurrencyNotFoundException,
} from "../exceptions/expense.exceptions";
import { CategoryService } from "../../category/category.service";
import { ExpenseStatusMessages } from "../config/expense-response-messages";
import * as dayjs from "dayjs";

export class ManageExpense {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
    private readonly utils: Utils
  ) {}

  async createExpense(
    data: CreateExpenseDto,
    userId: number,
    file: fileType | null | undefined
  ): Promise<createExpenseResponse> {
    let fileUrl = "";
    if (file) {
      fileUrl = await this.utils.uploadImageToCloudinary({
        imagePath: file.path,
        asset_folder: "/trackabl/receipts/" + userId,
      });
    }

    if (!data.categoryId) {
      throw new CategoryRequiredException();
    }

    const getCategory = await this.categoryService.findCategoryUsingId(
      data.categoryId
    );

    if (!getCategory) {
      throw new CategoryNotFoundException();
    }

    if (!data.subcategoryId) {
      throw new SubcategoryRequiredException();
    }

    const getSubcategory = await this.categoryService.findSubcategoryUsingId(
      data.subcategoryId
    );

    if (!getSubcategory) {
      throw new SubcategoryNotFoundException();
    }

    if (!data.currencyId) {
      throw new CurrencyRequiredException();
    }

    const getCurrency = await this.expenseService.findCurrencyUsingID(
      data.currencyId
    );
    if (!getCurrency) {
      throw new CurrencyNotFoundException();
    }

    const expenseDate = new Date(data.expenseDate);
    const expenseDateToUnix = dayjs(data.expenseDate).unix();

    return {
      status: true,
      message: ExpenseStatusMessages.Create.success,
      data: await this.expenseService.createExpense({
        categoryId: data.categoryId,
        expenseDate,
        expenseDateInUnixTimestamp: expenseDateToUnix,
        amount: data.amount,
        currencyId: data.currencyId,
        note: data.note,
        subcategoryId: data.subcategoryId,
        userId,
        receipt: fileUrl.length > 0 ? fileUrl : null,
      }),
    };
  }
}
