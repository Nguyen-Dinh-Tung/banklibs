import { Controller, Get, Query } from '@nestjs/common';
import { AdminLogService } from './admin-log.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryAdminLogDto } from './dto/query-admin-log.dto';

@Controller('admin-log')
@ApiTags('Admin log')
@ApiBearerAuth()
export class AdminLogController {
  constructor(private readonly adminLogService: AdminLogService) {}

  @Get()
  async findAll(@Query() query: QueryAdminLogDto) {
    return await this.adminLogService.findAll(query);
  }
}
