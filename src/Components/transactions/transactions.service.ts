import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { SystemTokenModel } from "./models/system-tokens.model";
import { TemporaryRemittanceModel } from "./models/temporary-remittances.model";
import {
  TemporaryAddressInterface,
  UpdateTemporaryAddressInterface,
} from "./types/transactions.types";
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(SystemTokenModel)
    private readonly systemTokenModel: typeof SystemTokenModel,
    @InjectModel(TemporaryRemittanceModel)
    private readonly temporaryRemittanceModel: typeof TemporaryRemittanceModel
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return "This action adds a new transaction";
  }

  findAll() {
    return `This action returns all transactions`;
  }

  async findToken(id: number): Promise<SystemTokenModel | null> {
    try {
      return await this.systemTokenModel.findOne({
        where: {
          systemTokenId: id,
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new Error();
    }
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async getAllSystemTokens(): Promise<SystemTokenModel[]> {
    try {
      return await this.systemTokenModel.findAll({
        attributes: {
          exclude: ["address"],
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new Error();
    }
  }

  async getTemporaryTransactionByAddress(
    address: string
  ): Promise<TemporaryRemittanceModel | null> {
    try {
      return await this.temporaryRemittanceModel.findOne({
        where: {
          binanceTemporalWalletID: address,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async updateTemporalTransactionusingId(
    tempTransactionId: number,
    data: UpdateTemporaryAddressInterface
  ): Promise<[affectedCount: number]> {
    try {
      return await this.temporaryRemittanceModel.update(
        {
          ...data,
        },
        {
          where: { id: tempTransactionId },
        }
      );
    } catch (error) {
      console.log(error);
      return [0];
    }
  }

  async storeTemporaryAddress(
    data: TemporaryAddressInterface
  ): Promise<TemporaryRemittanceModel> {
    try {
      return this.temporaryRemittanceModel.create({ ...data });
    } catch (error) {
      console.log(error.message);
      throw new Error();
    }
  }
}
