import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user-admin')
@ApiTags('User admin')
@ApiBearerAuth()
export class UserAdminController {}
