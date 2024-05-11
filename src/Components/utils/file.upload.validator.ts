import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { MulterError } from "multer";

@Injectable()
export class AllowedFileTypesValidator implements PipeTransform {
  constructor(
    private readonly allowedExtensions: string[],
    private readonly validationMessage: string
  ) {}

  async transform(
    file: Express.Multer.File,
    value: any
  ): Promise<Express.Multer.File | null> {
    if (file && file.filename) {
      const originalName = file.originalname ? file.originalname : "";

      const split = originalName.split(".");

      const allowed = file.originalname
        ? this.allowedExtensions.includes(
            split[split.length - 1].toLowerCase() ?? ""
          )
        : false;
      if (!allowed) {
        throw new BadRequestException(this.validationMessage);
      }

      return file;
    }

    return file;
  }
}
