import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import {
  CreateTenantContractDto,
  UpdateTenantContractDto,
} from './tenant-contract.dto';
import { cleanObject } from 'src/common/utils';
import { RpcException } from '@nestjs/microservices';
import { IFilter } from 'src/common/decorators';

@Injectable()
export class TenantContractService {
  constructor(private readonly prisma: PrismaService) {}

  async count(filter: IFilter) {
    const where = filter.where || {};
    const ids =
      where.id?.in ||
      (where.AND?.find((cond) => cond?.id?.in) || {}).id?.in ||
      [];
    return this.prisma.tenantContract.count({ where: { id: { in: ids } } });
  }

  async create(createTenantContractDto: CreateTenantContractDto) {
    try {
      const tenantContract = await this.prisma.tenantContract.create({
        data: createTenantContractDto,
        include: { room: true },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'tenantContract',
          resourceId: tenantContract.id,
          userId: createTenantContractDto.createdBy,
        },
      });

      return tenantContract;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.tenantContract.findMany({
      where: filter?.where,
      skip: filter?.skip,
      take: filter?.take,
      orderBy: { updatedAt: 'desc' },
      include: { room: true },
    });
  }

  async findOne(id: number) {
    const tenantContract = await this.prisma.tenantContract.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!tenantContract) throw new RpcException(new NotFoundException());

    return tenantContract;
  }

  async update(id: number, updateTenantContractDto: UpdateTenantContractDto) {
    await this.findOne(id);

    try {
      const updatedTenantContract = await this.prisma.tenantContract.update({
        where: { id },
        data: cleanObject({
          ...updateTenantContractDto,
          updatedBy: updateTenantContractDto.updatedBy,
        }),
        include: { room: true },
      });

      return updatedTenantContract;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.tenantContract.delete({ where: { id } });
  }
}
