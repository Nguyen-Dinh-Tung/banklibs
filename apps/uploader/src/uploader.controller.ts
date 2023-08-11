import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ValidatorFilesPipe } from './pipe/validate-files.pipe';
import { ValidatorFilePipe } from './pipe/validate-file.pipe';

@ApiTags('Uploader')
@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post('user')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'frontCard', maxCount: 1 },
      { name: 'backCard', maxCount: 1 },
    ]),
  )
  registerUser(
    @UploadedFiles(new ValidatorFilesPipe())
    files: Array<Express.Multer.File>,
  ) {
    return this.uploaderService.registerUser(files);
  }

  @Patch('user')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @UploadedFile(new ValidatorFilePipe())
    file: Express.Multer.File,
  ) {
    return await this.uploaderService.updateUser(file);
  }
}
