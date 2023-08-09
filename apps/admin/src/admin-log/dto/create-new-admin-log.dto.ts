import { AppTypeLogEnum, UserAdminEntity } from '@app/common';

export class CreateNewAdminLogDto {
  type: AppTypeLogEnum;
  data: string;
  entity: string;
  IdEntity: string;
  user: UserAdminEntity;
}
