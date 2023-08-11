import { User, UserEntity } from '@app/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserBalanceService } from './user-balance.service';
import { CheckUserBalanceDto } from './dto/check-user-balance.dto';
import { CheckReceiverDto } from './dto/check-receiver.dto';

@Controller('user-balance')
@ApiTags('User balance')
@ApiBearerAuth()
export class UserBalanceController {
  constructor(private readonly userBalanceService: UserBalanceService) {}

  @Post('check')
  async checkBalance(
    @User() user: UserEntity,
    @Body() data: CheckUserBalanceDto,
  ) {
    return await this.userBalanceService.checkBalance(user, data);
  }

  @Post('check-receiver')
  async checkReceiver(@Body() data: CheckReceiverDto) {
    return await this.userBalanceService.checkReceiver(data);
  }
}
