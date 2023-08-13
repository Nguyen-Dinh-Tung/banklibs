import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { FeeService } from './fee.service';
import { User, UserAdminEntity } from '@app/common';
import { CreateFeeSystemDto } from './dto/create-fee.dto';
import { QuerySystemfeeDto } from './dto/query-fee.dto';
import { SystemFeeApplyDto } from './dto/system-fee-apply.dto';
import { SystemFeeSettingDto } from './dto/system-fee-setting.dto';
import { CreateFeeOwnDto } from './dto/create-fee-own.dto';

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

  @Get('system')
  async getSystemFee(@Query() query: QuerySystemfeeDto) {
    return await this.feeService.getSystemFee(query);
  }

  @Post('system/setting')
  async createSystemFeeSetting(
    @User() user: UserAdminEntity,
    @Body() data: SystemFeeSettingDto,
  ) {
    return await this.feeService.createSystemFeeSetting(user, data);
  }

  @Patch('system/apply')
  async systemFeeApply(
    @User() user: UserAdminEntity,
    @Body() data: SystemFeeApplyDto,
  ) {
    return await this.feeService.systemFeeApply(user, data);
  }

  @Post('own')
  async createFeeOwn(
    @User() user: UserAdminEntity,
    @Body() data: CreateFeeOwnDto,
  ) {
    return await this.feeService.createFeeOwn(user, data);
  }
}
