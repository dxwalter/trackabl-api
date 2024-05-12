import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { ExpenseModel } from "./model/expense.model";
import { CurrencyModel } from "./model/currencies.model";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { createExpense, UpdateExpense } from "./types/expense.types";
import {
  ExpenseSqlQuery,
  getExpenseSqlQueryInterface,
  AggregateExpenseByCategoryOrSubcategory,
} from "./model/queries/getExpenses.query";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(ExpenseModel)
    private readonly expenseModel: typeof ExpenseModel,
    @InjectModel(CurrencyModel)
    private readonly currencyModel: typeof CurrencyModel,
    protected eventEmitter: EventEmitter2
  ) {}

  async createExpense(data: createExpense): Promise<ExpenseModel> {
    try {
      return await this.expenseModel.create({
        ...data,
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting categories for admin`,
        severity: "HIGH",
        details: {
          service: "ExpenseService.createExpense",
          payload: data,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred creating your expense");
    }
  }

  async GetAllCurrencies(): Promise<CurrencyModel[]> {
    try {
      return await this.currencyModel.findAll();
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred getting currencies`,
        severity: "HIGH",
        details: {
          service: "ExpenseService.GetAllCurrencies",
          payload: {},
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred getting currencies");
    }
  }

  async findCurrencyUsingID(id: number): Promise<CurrencyModel | null> {
    try {
      return await this.currencyModel.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred finding currency: ${id}`,
        severity: "HIGH",
        details: {
          service: "ExpenseService.findCurrencyUsingID",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred validating currency");
    }
  }

  async findExpense(id: number): Promise<ExpenseModel | null> {
    try {
      return await this.expenseModel.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `An error occurred finding expense: ${id}`,
        severity: "HIGH",
        details: {
          service: "ExpenseService.findExpense",
          payload: id,
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred editing this expense");
    }
  }

  async updateExpenseRecord(id: number, updateExense: UpdateExpense) {
    try {
      return await this.expenseModel.update(
        { ...updateExense },
        {
          where: { id },
        }
      );
    } catch (error) {
      Error.captureStackTrace(error);
      this.eventEmitter.emit("log.system.error", {
        message: `Error updating expense: ${id}`,
        severity: "HIGH",
        details: {
          service: "ExpenseService.updateExpenseRecord",
          payload: {
            id,
            ...updateExense,
          },
          stack: error.stack.toString(),
        },
      } as SystemErrorLogDTO);

      throw new BadRequestException("An error occurred editing expense");
    }
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  async GetExpenses(
    data: getExpenseSqlQueryInterface
  ): Promise<ExpenseModel[]> {
    return await new ExpenseSqlQuery(
      this.expenseModel,
      this.eventEmitter
    ).getExpensesInChronologicalOrder(data);
  }

  async aggregateExpensesForCategory(
    data: getExpenseSqlQueryInterface
  ): Promise<AggregateExpenseByCategoryOrSubcategory> {
    return await new ExpenseSqlQuery(
      this.expenseModel,
      this.eventEmitter
    ).aggregateCategoryExpense(data);
  }

  async aggregateExpensesForSubcategory(
    data: getExpenseSqlQueryInterface
  ): Promise<AggregateExpenseByCategoryOrSubcategory> {
    return await new ExpenseSqlQuery(
      this.expenseModel,
      this.eventEmitter
    ).aggregateSubcategoryExpense(data);
  }
}
