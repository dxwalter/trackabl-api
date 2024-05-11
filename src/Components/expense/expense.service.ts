import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { ExpenseModel } from "./model/expense.model";
import { CurrencyModel } from "./model/currencies.model";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SystemErrorLogDTO } from "../globals/types/globel.types";
import { createExpense } from "./types/expense.types";

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

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
