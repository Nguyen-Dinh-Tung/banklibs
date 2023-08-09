import { AdminLogsEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewAdminLogDto } from './dto/create-new-admin-log.dto';

@Injectable()
export class AdminLogService {
  constructor(
    @InjectRepository(AdminLogsEntity)
    private readonly adminLogsRepo: Repository<AdminLogsEntity>,
  ) {}

  async createNewAdminLog(data: CreateNewAdminLogDto) {
    await this.adminLogsRepo.insert(
      this.adminLogsRepo.create({
        data: data.data,
        idEntity: data.IdEntity,
        type: data.type,
        user: data.user,
        entity: data.entity,
      }),
    );
  }

  async findAll() {
    const data = await this.adminLogsRepo.find();

    return {
      docs: data,
    };
  }
}
