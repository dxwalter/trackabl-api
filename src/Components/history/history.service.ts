import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { TokenWalletHistory } from "./models/token-wallet-history";
import { TokenHistoryType } from "./types/history.type";
import { Op } from "sequelize";

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(TokenWalletHistory)
    private readonly tokenWalletHistory: typeof TokenWalletHistory
  ) {}

  async createHistoryEntry(
    createHistoryDto: TokenHistoryType
  ): Promise<TokenWalletHistory> {
    try {
      return await this.tokenWalletHistory.create({ ...createHistoryDto });
    } catch (error) {
      console.log(error.message);
      // Log failed request
      throw new Error();
    }
  }

  async getLastHistoryEntryForUserPerToken(
    userId: number,
    systemTokenId: number
  ): Promise<TokenWalletHistory | null> {
    try {
      return await this.tokenWalletHistory.findOne({
        where: {
          [Op.and]: [{ userId }, { systemTokenId }],
        },
        order: [["id", "DESC"]],
      });
    } catch (error) {
      // log response
      console.log(error.message);
      throw new Error();
    }
  }

  findAll() {
    return `This action returns all history`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }
}
