import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { parseJSON, parseNumber } from '../utils';

export interface IFilter {
  take?: number;
  skip?: number;
  where?: Record<string, any>;
  include?: Record<string, boolean | any>;
  orderBy?: Record<string, 'asc' | 'desc' | any>;
  select?: Record<string, boolean | any>;
}

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
