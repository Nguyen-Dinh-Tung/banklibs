import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { User, UserEntity } from '@app/common';
import { QueryBalanceDto } from './dto/query-balance.dto';

@Controller('user-balance')
@ApiTags('User balance')
@ApiBearerAuth()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('history')
  async getHistory(@Query() query: QueryBalanceDto, @User() user: UserEntity) {
    return this.balanceService.getHistory(query, user);
  }
}
