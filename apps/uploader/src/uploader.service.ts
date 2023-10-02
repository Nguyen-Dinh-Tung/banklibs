import { AppHttpBadRequestException, UploaderErrors } from '@app/exceptions';
import { Injectable } from '@nestjs/common';
import { RegisterUserInterface } from './interface/register-user.interface';
import { saveImage } from '@app/common';
import { UpdateUserInterface } from './interface/update-user.interface';

@Injectable()
export class UploaderService {
  registerUser(files: Array<Express.Multer.File>) {
    if (Object.keys(files).length != 3) {
      throw new AppHttpBadRequestException(UploaderErrors.ERROR_MISSING_FILES);
    }

    const data: RegisterUserInterface = {
      avatar: '',
      frontCard: '',
      backCard: '',
    };

    Object.keys(files).some((key) => {
      data[key] = saveImage(files[key][0], process.env.UPLOAD_USER_REGISTER);
    });

    return {
      docs: data,
    };
  }

  async updateUser(file: Express.Multer.File) {
    if (!file) {
      throw new AppHttpBadRequestException(UploaderErrors.ERROR_MISSING_FILES);
    }

    const data: UpdateUserInterface = {};

    data.avatar = saveImage(file, process.env.UPLOAD_USER_REGISTER);

    return {
      docs: data,
    };
  }
}
