import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type as TransformType } from 'class-transformer';
import { Type } from '@nestjs/common';
export class PageRequest {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional()
  @TransformType(() => Number)
  readonly page: number = 1;

  @IsNumber()
  @Min(10)
  @Max(100)
  @IsOptional()
  @ApiPropertyOptional()
  @TransformType(() => Number)
  readonly limit: number = 10;

  public getSkip() {
    return (this.page - 1) * this.limit;
  }
}
export class PageMeta {
  @ApiProperty()
  public page: number;
  @ApiProperty()
  public total: number;
  @ApiProperty()
  public limit: number;

  constructor(page: number, total: number, limit: number) {
    this.page = page;
    this.total = total;
    this.limit = limit;
  }
}
interface IPaginated<T> {
  docs: T[];
  meta: PageMeta;
}
export function Paginate<T>(classRef: Type<T>) {
  class Paginated implements IPaginated<T> {
    @ApiProperty({ type: classRef, isArray: true })
    docs: T[];

    @ApiProperty({ type: () => PageMeta })
    meta: PageMeta;

    constructor(docs: T[], meta: PageMeta) {
      this.docs = docs;
      this.meta = meta;
    }
  }
  return Paginated;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly totalPage: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ page, limit, total }: IPageMetaDto) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPage = Math.ceil(this.total / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPage;
  }
}

interface IPageMetaDto {
  page: number;
  limit: number;
  total: number;
}
