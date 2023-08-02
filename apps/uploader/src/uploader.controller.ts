import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ValidatorFilePipe } from './pipe/validate-file.pipe';

@ApiTags('Uploader')
@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'frontCard', maxCount: 1 },
      { name: 'backCard', maxCount: 1 },
    ]),
  )
  registerUser(
    @UploadedFiles(new ValidatorFilePipe())
    files: Array<Express.Multer.File>,
  ) {
    return this.uploaderService.registerUser(files);
  }
}
