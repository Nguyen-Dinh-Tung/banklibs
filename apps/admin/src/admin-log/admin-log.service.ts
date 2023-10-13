import { AdminLogsEntity, PageMeta } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewAdminLogDto } from './dto/create-new-admin-log.dto';
import { AdminLogInfor, QueryAdminLogDto } from './dto/query-admin-log.dto';

@Injectable()
export class AdminLogService {
  constructor(
    @InjectRepository(AdminLogsEntity)
    private readonly adminLogsRepo: Repository<AdminLogsEntity>,
  ) {}

  async createNewAdminLog(data: CreateNewAdminLogDto) {
    await this.adminLogsRepo.insert(
      this.adminLogsRepo.create({
        data: JSON.stringify(data.data),
        idEntity: data.IdEntity,
        type: data.type,
        user: data.user,
        entity: data.entity,
        createdAt: new Date().toISOString(),
      }),
    );
  }

  async findAll(query: QueryAdminLogDto) {
    const where = {};

    if (query.idAdmin) {
      where['idAdmin'] = query.idAdmin;
    }

    if (query.entity) {
      query['entity'] = query.entity;
    }

    const data = await this.adminLogsRepo.find({
      where: where,
      take: query.limit,
      skip: query.skip,
    });

    return new AdminLogInfor(
      data.length
        ? data.map((e: AdminLogsEntity) => {
            e.data = JSON.parse(e.data);
            return e;
          })
        : data,
      new PageMeta(query.page, data.length, query.limit),
    );
  }
}
