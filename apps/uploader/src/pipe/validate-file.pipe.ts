import {
  AppHttpBadRequestExceptionException,
  UploaderErrors,
} from '@app/exceptions';
import { Injectable, PipeTransform } from '@nestjs/common';
const mimeType = ['jpg', 'jpeg', 'png'];
@Injectable()
export class ValidatorFilePipe implements PipeTransform {
  transform(value: any) {
    this.validator(value);
    return value;
  }

  validator(file?: Express.Multer.File) {
    const fileType = file.mimetype.split('/')[file.mimetype.split.length - 1];
    if (!mimeType.includes(fileType))
      throw new AppHttpBadRequestExceptionException(
        UploaderErrors.ERROR_MIMETYPE_NOT_SUPPORT,
      );
  }
}
