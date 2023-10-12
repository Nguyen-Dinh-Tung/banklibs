import { UploaderErrors } from '@app/exceptions';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
const mimeType = ['jpeg', 'jpg', 'png'];
@Injectable()
export class ValidatorFilesPipe implements PipeTransform {
  transform(value: Express.Multer.File | Array<Express.Multer.File>) {
    for (const e in value) {
      if (Array.isArray(value[e])) {
        this.validator(value[e][0]);
      } else {
        this.validator(value as Express.Multer.File);
      }
    }
    return value;
  }

  validator(file?: Express.Multer.File) {
    const fileType = file.mimetype.split('/')[file.mimetype.split.length - 1];
    if (!mimeType.includes(fileType)) {
      throw new BadRequestException(UploaderErrors.ERROR_MIMETYPE_NOT_SUPPORT);
    }
  }
}
