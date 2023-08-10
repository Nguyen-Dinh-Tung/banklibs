import { AppHttpBadRequest, UploaderErrors } from '@app/exceptions';
import { Injectable } from '@nestjs/common';
import { RegisterUserInterface } from './interface/register-user.interface';
import { saveImage } from '@app/common';

@Injectable()
export class UploaderService {
  registerUser(files: Array<Express.Multer.File>) {
    if (Object.keys(files).length != 3) {
      throw new AppHttpBadRequest(UploaderErrors.ERROR_MISSING_FILES);
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
      success: true,
      docs: data,
    };
  }
}
