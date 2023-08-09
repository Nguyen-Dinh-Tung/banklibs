import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '@app/common/entities';
import { AdminLogModule } from '../admin-log/admin-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity]), AdminLogModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
