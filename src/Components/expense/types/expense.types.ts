import { GlobalRequestResponse } from "../../globals/global.types";
import { ExpenseModel } from "../model/expense.model";
import { CurrencyModel } from "../model/currencies.model";

export interface createExpense {
  userId: number;
  categoryId: number;
  subcategoryId: number;
  currencyId: number;
  amount: number;
  receipt?: string | null;
  note: string;
  expenseDateInUnixTimestamp: number;
  expenseDate: Date;
}

export interface UpdateExpense {
  id?: number;
  categoryId?: number;
  subcategoryId?: number;
  currencyId?: number;
  amount?: number;
  receipt?: string | null;
  note?: string;
  expenseDateInUnixTimestamp?: number;
  expenseDate?: Date;
}

export interface createExpenseResponse extends GlobalRequestResponse {
  data: ExpenseModel | null;
}

export interface getCurrenciesResponse extends GlobalRequestResponse {
  data: CurrencyModel[];
}
