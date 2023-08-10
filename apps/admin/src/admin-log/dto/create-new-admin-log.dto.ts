import { AppTypeLogEnum, UserAdminEntity } from '@app/common';

export class CreateNewAdminLogDto {
  type: AppTypeLogEnum;
  data: any;
  entity: string;
  IdEntity: string;
  user: UserAdminEntity;
}
