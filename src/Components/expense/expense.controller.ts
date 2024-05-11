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
  UsePipes,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExpenseStatusMessages } from "./config/expense-response-messages";

import { ExpenseService } from "./expense.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import {
  createExpenseResponse,
  getCurrenciesResponse,
} from "./types/expense.types";
import { Utils } from "../utils";
import { ManageExpense } from "./classes/CreateExpense";
import { AuthGuard } from "../user/guard/auth.guard";
import { AllowedFileTypesValidator } from "../utils/file.upload.validator";
import { CategoryService } from "../category/category.service";

@Controller("expense")
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
    private readonly utils: Utils
  ) {}

  @UseInterceptors(FileInterceptor("receipt"))
  @UsePipes(
    new AllowedFileTypesValidator(
      ["png", "jpeg", "jpg"],
      ".PNG, .JPEG, .JPG are the allowed file types"
    )
  ) // Apply custom validator if needed
  @UseGuards(AuthGuard)
  @Post("/")
  async createExpense(
    @Body() data: CreateExpenseDto,
    @Request() req: any,
    @UploadedFile()
    file: Express.Multer.File | null | undefined
  ): Promise<createExpenseResponse> {
    return await new ManageExpense(
      this.expenseService,
      this.categoryService,
      this.utils
    ).createExpense(data, req.user.id, file);
  }

  @UseGuards(AuthGuard)
  @Get("/currencies")
  async getAllCurrencies(): Promise<getCurrenciesResponse> {
    return {
      status: true,
      message: ExpenseStatusMessages.default,
      data: await this.expenseService.GetAllCurrencies(),
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.expenseService.remove(+id);
  }
}
