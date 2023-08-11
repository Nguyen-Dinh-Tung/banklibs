import { Body, Controller, Post } from '@nestjs/common';
import { FeeService } from './fee.service';
import { User, UserAdminEntity } from '@app/common';
import { CreateFeeSystemDto } from './dto/create-fee.dto';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post('system')
  async createFeeSystem(
    @User() user: UserAdminEntity,
    @Body() data: CreateFeeSystemDto,
  ) {
    return await this.feeService.createFeeSystem(user, data);
  }
}
