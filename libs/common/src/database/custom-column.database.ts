import { Column, ColumnOptions } from 'typeorm';

export const DateColumn = (options?: ColumnOptions) => {
  return Column('timestamp', { ...options, precision: 3 });
};

export const NotNullColum = (options?: ColumnOptions) => {
  return Column({ ...options, nullable: false });
};

export const NullColumn = (options?: ColumnOptions) => {
  return Column({ ...options, nullable: true });
};

export const IsActiveTrueColumn = (options?: ColumnOptions) => {
  return Column({ ...options, default: true, name: 'is_active' });
};

export const IsActiveFalseColumn = (options?: ColumnOptions) => {
  return Column({ ...options, default: false, name: 'is_active' });
};
