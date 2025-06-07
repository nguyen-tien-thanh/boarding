import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateAssetDto, UpdateAssetDto } from './asset.dto';
import { IFilter } from 'src/common/decorators';
import { cleanObject } from 'src/common/utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async count(filter: IFilter) {
    const where = filter.where || {};
    const ids =
      where.id?.in ||
      (where.AND?.find((cond) => cond?.id?.in) || {}).id?.in ||
      [];
    return this.prisma.asset.count({ where: { id: { in: ids } } });
  }

  async create(createAssetDto: CreateAssetDto) {
    try {
      const asset = await this.prisma.asset.create({
        data: createAssetDto,
        include: { category: true, roomAssets: true },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'asset',
          resourceId: asset.id,
          userId: createAssetDto.createdBy,
        },
      });

      return asset;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.asset.findMany({
      orderBy: { updatedAt: 'desc', ...filter.orderBy },
      ...filter,
    });
  }

  async findOne(id: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: { category: true, roomAssets: true },
    });

    if (!asset) throw new RpcException(new NotFoundException());

    return asset;
  }

  async update(id: number, updateAssetDto: UpdateAssetDto) {
    await this.findOne(id);

    try {
      const updatedAsset = await this.prisma.asset.update({
        where: { id },
        data: cleanObject({
          ...updateAssetDto,
          updatedBy: updateAssetDto.updatedBy,
        }),
        include: { category: true, roomAssets: true },
      });

      return updatedAsset;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.asset.delete({ where: { id } });
  }
}
