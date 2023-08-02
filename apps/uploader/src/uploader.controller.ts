import { Controller, Get } from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Controller()
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Get()
  getHello(): string {
    return this.uploaderService.getHello();
  }
}
