import { IsOptional, IsNotEmpty } from "class-validator";
export class QueryExpensesDto {
  @IsOptional()
  readonly startDate?: Date;

  @IsNotEmpty()
  readonly endDate: Date;

  @IsOptional()
  readonly subcategoryId?: number;

  @IsOptional()
  readonly categoryId?: number;

  @IsNotEmpty()
  readonly pageNumber: number;

  @IsNotEmpty()
  readonly aggregate: string;
}
