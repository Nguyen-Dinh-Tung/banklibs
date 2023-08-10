import { Injectable } from '@nestjs/common';
import { QueryUserDto, UserInfor } from './dto/query-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto, UserEntity } from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(query: QueryUserDto) {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .offset(query.getSkip())
      .limit(query.limit)
      .orderBy('user.createdAt', query.order);

    if (query.startDate) {
      queryBuilder.andWhere('user.createdAt >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('user.createdAt >= :endDate', {
        endDate: query.endDate,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return new UserInfor(
      data,
      new PageMetaDto({ page: query.page, limit: query.limit, total: total }),
    );
  }
}
