import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from './user/user.module';
import { CoreModule, EnvVariable, JwtModuleDynamic } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { AdminLogModule } from './admin-log/admin-log.module';
import { InititalModule } from './initial/initial.module';
import { UserAdminModule } from './user-admin/user-admin.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    InititalModule,
    UserModule,
    AuthModule,
    JobModule,
    AdminLogModule,
    UserAdminModule,
    JwtModuleDynamic.registerAsync(EnvVariable.SECRET_KEY),
  ],
  controllers: [AdminController],
  providers: [AdminService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AdminModule {}
