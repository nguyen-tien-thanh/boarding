import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { parseJSON, parseNumber } from '../utils';
import { IFilter } from './filter.decorator';

/**
 * Parameter decorator that extracts filter from RPC data and automatically
 * applies resource member access control by merging allowedResourceIds
 *
 * @param resourceIdField - The field name to filter by (defaults to 'id')
 */
export const ResourceFilter = createParamDecorator(
  (resourceIdField: string = 'id', ctx: ExecutionContext): IFilter => {
    const data = ctx.switchToRpc().getData();
    const { take, skip, where, include, select, orderBy } = data?.filter || {};

    const filter: IFilter = {};

    if (where) filter.where = parseJSON(where);
    filter.take = parseNumber(take, 10);
    filter.skip = parseNumber(skip, 0);
    if (include) filter.include = parseJSON(include);
    if (orderBy) filter.orderBy = parseJSON(orderBy);
    if (select && !filter.include) filter.select = parseJSON(select);

    if (data.allowedResourceIds?.length) {
      const resourceFilter = {
        [resourceIdField]: { in: data.allowedResourceIds },
      };

      filter.where = filter.where
        ? {
            AND: filter.where.AND
              ? [...filter.where.AND, resourceFilter]
              : [{ ...filter.where }, resourceFilter],
          }
        : resourceFilter;
    }

    return filter;
  },
);
