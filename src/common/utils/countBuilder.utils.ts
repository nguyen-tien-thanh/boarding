import { PrismaClient } from '@prisma/client';
import { IFilter } from '../decorators';
const prisma = new PrismaClient();

export function countBuilder(resourceName: string) {
  const idKey = 'id';

  function extractIds(where: any = {}): number[] {
    return (
      where[idKey]?.in ||
      (Array.isArray(where.AND)
        ? where.AND.find((cond) => cond?.[idKey]?.in)?.[idKey]?.in
        : []) ||
      []
    );
  }

  return async function count(filter: IFilter) {
    const where = filter.where || {};
    const ids = extractIds(where);

    if (ids.length === 0) {
      return prisma[resourceName].count({ where });
    }

    return prisma[resourceName].count({ where: { [idKey]: { in: ids } } });
  };
}
