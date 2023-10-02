import { Repository } from 'typeorm';

export const genCodeRefund = async (
  prefix: string,
  length: number,
  repo: Repository<any>,
) => {
  const totalCount = await repo.count();
  let body = 10;
  for (let i = 0; i <= length; i++) {
    body = body * 10;
  }
  const index = String(body + totalCount);
  return `${prefix}${index.slice(0, index.length)}`;
};
