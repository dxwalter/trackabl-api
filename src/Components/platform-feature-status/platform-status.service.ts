import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreatePlatformFeatureStatusDto } from "./dto/create-platform-status.dto";
import { UpdatePlatformStatusDto } from "./dto/update-platform-status.dto";
import { PlatformFeatureStatus } from "./models/platform-feature-status.model";
import { GlobalErrorService } from "../globals/global.error.service";

@Injectable()
export class PlatformFeatureStatusService {
  constructor(
    @InjectModel(PlatformFeatureStatus)
    private readonly plaformFeature: typeof PlatformFeatureStatus
  ) {}

  async create(
    createPlatformStatusDto: CreatePlatformFeatureStatusDto
  ): Promise<PlatformFeatureStatus> {
    try {
      return await this.plaformFeature.create({ ...createPlatformStatusDto });
    } catch (error) {
      throw new BadRequestException("An error occurred creating a new feature");
    }
  }

  findAll() {
    return `This action returns all platformStatus`;
  }

  async findOne(feature: string): Promise<PlatformFeatureStatus | null> {
    try {
      return await this.plaformFeature.findOne({
        where: {
          feature,
        },
      });
    } catch (error) {
      throw new BadRequestException("An error occurred finding this feature");
    }
  }

  async findOneWithId(id: number): Promise<PlatformFeatureStatus | null> {
    try {
      return await this.plaformFeature.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException("An error occurred finding this feature");
    }
  }

  async update(id: number, updatePlatformStatusDto: UpdatePlatformStatusDto) {
    try {
      return await this.plaformFeature.update(
        { ...updatePlatformStatusDto },
        {
          where: { id },
        }
      );
    } catch (error) {
      throw new BadRequestException("An error occurred updating this feature");
    }
  }

  async remove(id: number): Promise<any> {
    try {
      return await this.plaformFeature.destroy({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        "An error occurred deleting this feature status"
      );
    }
  }
}
