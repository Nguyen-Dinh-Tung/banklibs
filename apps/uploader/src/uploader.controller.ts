import {
  Controller,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ValidatorFilesPipe } from './pipe/validate-files.pipe';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    @Body() data: RegisterUserDto,
    @UploadedFiles(new ValidatorFilesPipe())
    files?: Array<Express.Multer.File>,
  ) {
    return this.uploaderService.registerUser(files);
  }

  @Patch('user')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Body() data: UpdateUserDto,
    @UploadedFile(new ValidatorFilesPipe())
    file?: Express.Multer.File,
  ) {
    return await this.uploaderService.updateUser(file);
  }
}
