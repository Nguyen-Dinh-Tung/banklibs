import { Module } from '@nestjs/common';
import { AdminLogController } from './admin-log.controller';
import { AdminLogService } from './admin-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLogsEntity, UserAdminEntity } from '@app/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserAdminEntity, AdminLogsEntity])],
  controllers: [AdminLogController],
  providers: [AdminLogService],
  exports: [AdminLogService],
})
export class AdminLogModule {}
