import { Module } from '@nestjs/common';
import { FeeController } from './fee.controller';
import { FeeService } from './fee.service';
import { AdminLogModule } from '../admin-log/admin-log.module';

@Module({
  imports: [AdminLogModule],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
