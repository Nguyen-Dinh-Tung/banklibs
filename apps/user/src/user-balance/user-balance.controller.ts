import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserBalanceService } from './user-balance.service';

@Controller('user-balance')
@ApiTags('User balance')
@ApiBearerAuth()
export class UserBalanceController {
  constructor(private readonly userBalanceService: UserBalanceService) {}
}
