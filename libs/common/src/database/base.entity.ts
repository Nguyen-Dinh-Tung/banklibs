import { DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DateColumn } from './custom-column.database';

export class IdEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class DateEntity {
  @DateColumn({ name: 'created_at' })
  createdAt: Date;
  @DateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export class DeleteEntity {
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

export class IdDateEntity extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class IdDateDeleteEntity extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class IdNumberEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export class IdNumberDateEntity extends DateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export class IdNumberDeleteDateEntity extends DeleteEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @DateColumn({ name: 'created_at' })
  createdAt: Date;
  @DateColumn({ name: 'updated_at' })
  updatedAt: Date;
}