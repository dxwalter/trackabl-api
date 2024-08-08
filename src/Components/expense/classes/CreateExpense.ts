import { ExpenseService } from "../expense.service";
import { Utils } from "../../utils";
import { CreateExpenseDto, EditExpenseDto } from "../dto/create-expense.dto";
import { createExpenseResponse } from "../types/expense.types";
import { fileType } from "../../../types/global.types";
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
import * as dayjs from "dayjs";
import { BadRequestException } from "@nestjs/common";

import { UserService } from "../../user/user.service";
import { GenerateReferralCodeForUser } from "../../user/classes/user/GenerateReferralCodeForUser";

export class ManageExpense {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
    private readonly utils: Utils,
    private readonly userService: UserService
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

    const categoryId = Number(data.categoryId);
    const subcategoryId = Number(data.subcategoryId);
    const currencyId = Number(data.currencyId);
    const amount = Number(data.amount);

    if (!categoryId) {
      throw new CategoryRequiredException();
    }

    const getCategory =
      await this.categoryService.findCategoryUsingId(categoryId);

    if (!getCategory) {
      throw new CategoryNotFoundException();
    }

    if (!subcategoryId) {
      throw new SubcategoryRequiredException();
    }

    const getSubcategory =
      await this.categoryService.findSubcategoryUsingId(subcategoryId);

    if (!getSubcategory) {
      throw new SubcategoryNotFoundException();
    }

    if (!data.currencyId) {
      throw new CurrencyRequiredException();
    }

    const getCurrency =
      await this.expenseService.findCurrencyUsingID(currencyId);
    if (!getCurrency) {
      throw new CurrencyNotFoundException();
    }

    const expenseDate = new Date(data.expenseDate);
    const expenseDateToUnix = dayjs(data.expenseDate).unix();

    return {
      status: true,
      message: ExpenseStatusMessages.Create.success,
      data: await this.expenseService.createExpense({
        categoryId: categoryId,
        expenseDate,
        expenseDateInUnixTimestamp: expenseDateToUnix,
        amount,
        currencyId: currencyId,
        note: data.note,
        subcategoryId: subcategoryId,
        userId,
        receipt: fileUrl.length > 0 ? fileUrl : null,
      }),
    };
  }

  async editExpsense(
    data: EditExpenseDto,
    userId: number,
    file: fileType | null | undefined,
    expenseId: number
  ): Promise<createExpenseResponse> {
    const categoryId = Number(data.categoryId);
    const subcategoryId = Number(data.subcategoryId);
    const currencyId = Number(data.currencyId);
    const amount = Number(data.amount);
    const getExpense = await this.expenseService.findExpense(expenseId);

    if (!getExpense) {
      throw new ExpenseNotFoundException();
    }

    const didUserRemoveImage = data.isOldPhotoRemoved;

    let fileUrl = "";
    if (file) {
      fileUrl = await this.utils.uploadImageToCloudinary({
        imagePath: file.path,
        asset_folder: "/trackabl/receipts/" + userId,
      });
    }

    const updatedFields = {};

    const expenseDate = new Date(data.expenseDate);
    const expenseDateToUnix = dayjs(data.expenseDate).unix();

    if (getExpense.categoryId !== categoryId) {
      updatedFields["categoryId"] = data.categoryId;
    }

    if (getExpense.subcategoryId !== subcategoryId) {
      updatedFields["subcategoryId"] = data.subcategoryId;
    }

    if (getExpense.expenseDateInUnixTimestamp !== expenseDateToUnix) {
      updatedFields["expenseDateInUnixTimestamp"] = expenseDateToUnix;
    }

    if (getExpense.expenseDate !== expenseDate) {
      updatedFields["expenseDate"] = expenseDate;
    }

    if (didUserRemoveImage && fileUrl) {
      updatedFields["receipt"] = fileUrl;
    }

    if (didUserRemoveImage && !fileUrl) {
      updatedFields["receipt"] = null;
    }

    if (getExpense.currencyId !== currencyId) {
      updatedFields["currencyId"] = data.currencyId;
    }

    if (getExpense.amount !== amount) {
      updatedFields["amount"] = amount;
    }

    if (getExpense.note !== data.note) {
      updatedFields["note"] = data.note;
    }

    // check if there is data to be updated
    if (Object.keys(updatedFields).length === 0) {
      throw new BadRequestException("No new data to be updated");
    }

    const updateExpense = await this.expenseService.updateExpenseRecord(
      expenseId,
      updatedFields
    );

    if (updateExpense[0] !== 1) {
      throw new BadRequestException();
    }

    const getUpdatedExpense = await this.expenseService.findExpense(expenseId);

    if (!getUpdatedExpense) {
      throw new ExpenseNotFoundException();
    }

    return {
      status: true,
      message: ExpenseStatusMessages.Update.success,
      data: getUpdatedExpense,
    };
  }
}
