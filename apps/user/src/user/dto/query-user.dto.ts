import { JobEntity, Paginate, QueryDate, UserEntity } from '@app/common';

export class QueryUserDto extends QueryDate {}

export class UserInforDto {
  id: string;

  fullname: string;

  phone: string;

  email: string;

  address: string;

  job: JobEntity;

  identifierNumber: string;

  age: number;

  avatar: string;

  backCard: string;

  frontCard: string;

  username: string;

  isActive: string;

  country: string;

  city: string;

  createdAt: Date;

  updatedAt: Date;
  constructor(entity: UserEntity) {
    this.id = entity.id;

    this.fullname = entity.fullname;

    this.email = entity.email;

    this.phone = entity.email;

    this.address = entity.address;

    this.job = entity.job;

    this.identifierNumber = this.identifierNumber;

    this.age = entity.age;

    this.avatar = this.avatar;

    this.backCard = entity.backCard;

    this.frontCard = entity.frontCard;

    this.username = entity.username;

    this.isActive = entity.isActive;

    this.country = entity.country;

    this.city = entity.city;
  }
}

export class UserInfor extends Paginate(UserInforDto) {}
