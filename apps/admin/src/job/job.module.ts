import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { AdminLogModule } from '../admin-log/admin-log.module';

@Module({
  imports: [AdminLogModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
