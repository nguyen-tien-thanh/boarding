import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import {
  CreateAssetCategoryDto,
  UpdateAssetCategoryDto,
} from './asset-category.dto';
import { IFilter } from 'src/common/decorators';
import { cleanObject } from 'src/common/utils/object.utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AssetCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async count(filter: IFilter) {
    const where = filter.where || {};
    const ids =
      where.id?.in ||
      (where.AND?.find((cond) => cond?.id?.in) || {}).id?.in ||
      [];
    return this.prisma.assetCategory.count({ where: { id: { in: ids } } });
  }

  async create(createAssetCategoryDto: CreateAssetCategoryDto) {
    try {
      const assetCategory = await this.prisma.assetCategory.create({
        data: createAssetCategoryDto,
        include: { assets: true },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'assetCategory',
          resourceId: assetCategory.id,
          userId: createAssetCategoryDto.createdBy,
        },
      });

      return assetCategory;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.assetCategory.findMany({
      orderBy: { updatedAt: 'desc', ...filter.orderBy },
      ...filter,
    });
  }

  async findOne(id: number) {
    const assetCategory = await this.prisma.assetCategory.findUnique({
      where: { id },
      include: { assets: true },
    });

    if (!assetCategory) throw new RpcException(new NotFoundException());

    return assetCategory;
  }

  async update(id: number, updateAssetCategoryDto: UpdateAssetCategoryDto) {
    await this.findOne(id);

    try {
      const updatedAssetCategory = await this.prisma.assetCategory.update({
        where: { id },
        data: cleanObject({
          ...updateAssetCategoryDto,
          updatedBy: updateAssetCategoryDto.updatedBy,
        }),
        include: { assets: true },
      });

      return updatedAssetCategory;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.assetCategory.delete({ where: { id } });
  }
}
