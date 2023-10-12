import { PageMetaDto } from '../dto';

export interface ResponseInterface<T> {
  docs: T;
  metadata?: PageMetaDto;
}
