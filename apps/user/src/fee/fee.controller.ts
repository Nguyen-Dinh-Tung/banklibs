import { User, UserEntity } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeeService } from './fee.service';
@Controller('fee')
@ApiTags('Fee')
@ApiBearerAuth()
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get('own')
  async getOwnFee(@User() user: UserEntity) {
    return await this.feeService.getOwnFee(user);
  }

  @Get('system')
  async getSystemFee(@User() user: UserEntity) {
    return await this.feeService.getSystemFee(user);
  }
}
