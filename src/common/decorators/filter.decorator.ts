import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface IFilter {
  take?: number;
  skip?: number;
  where?: Record<string, any>;
  include?: Record<string, boolean | any>;
  orderBy?: Record<string, 'asc' | 'desc' | any>;
  select?: Record<string, boolean | any>;
}

const parseJSON = (value: any): any => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
};

const parseNumber = (value: string | number, defaultValue = 0): number => {
  if (typeof value === 'number') return value;
  const num = Number(value);
  return !isNaN(num) ? num : defaultValue;
};

export const Filter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IFilter => {
    const { take, skip, where, include, select, orderBy } = ctx
      .switchToRpc()
      .getData()?.filter;

    const filter: IFilter = {};

    if (where) filter.where = parseJSON(where);
    filter.take = parseNumber(take, 10);
    filter.skip = parseNumber(skip, 0);
    if (include) filter.include = parseJSON(include);
    if (orderBy) filter.orderBy = parseJSON(orderBy);
    if (select && !filter.include) filter.select = parseJSON(select);

    return filter;
  },
);
