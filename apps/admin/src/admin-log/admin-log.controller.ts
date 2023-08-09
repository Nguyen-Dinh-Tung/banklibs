import { Controller } from '@nestjs/common';
import { AdminLogService } from './admin-log.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('admin-log')
@ApiTags('Admin log')
@ApiBearerAuth()
export class AdminLogController {
  constructor(private readonly adminLogService: AdminLogService) {}
}
