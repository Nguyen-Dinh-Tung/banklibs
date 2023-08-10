import { UserAdminEntity } from '@app/common';
import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAdminEntity])],
})
export class InititalModule implements OnModuleInit {
  constructor(
    @InjectRepository(UserAdminEntity)
    private readonly userAdminRepo: Repository<UserAdminEntity>,
  ) {}

  async onModuleInit() {
    const checkUserAdminDefault = await this.userAdminRepo.findOne({
      where: {
        username: process.env.USERNAME_ADMIN,
      },
    });

    if (checkUserAdminDefault) return;

    await this.userAdminRepo.insert(
      this.userAdminRepo.create({
        username: process.env.USERNAME_ADMIN,
        password: process.env.PASSWORD,
        phone: process.env.PHONE,
        email: process.env.EMAIL,
        createdAt: new Date().toISOString(),
        isRoot: true,
      }),
    );
  }
}
