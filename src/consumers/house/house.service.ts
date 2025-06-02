import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateHouseDto, UpdateHouseDto } from './house.dto';
import { IFilter } from 'src/common/decorators';
import { cleanObject } from 'src/common/utils/object.utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  async count(filter: IFilter) {
    const where = filter.where || {};
    const ids =
      where.id?.in ||
      (where.AND?.find((cond) => cond?.id?.in) || {}).id?.in ||
      [];
    return this.prisma.house.count({ where: { id: { in: ids } } });
  }

  async create(createHouseDto: CreateHouseDto) {
    try {
      const house = await this.prisma.house.create({
        data: createHouseDto,
        include: { rooms: true, qrCode: true },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'house',
          resourceId: house.id,
          userId: createHouseDto.createdBy,
        },
      });

      return house;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.house.findMany({
      orderBy: { updatedAt: 'desc', ...filter.orderBy },
      ...filter,
    });
  }

  async findOne(id: number) {
    const house = await this.prisma.house.findUnique({
      where: { id },
      include: {
        rooms: { include: { roomAssets: { include: { asset: true } } } },
        qrCode: true,
      },
    });

    if (!house) throw new RpcException(new NotFoundException());

    return house;
  }

  async update(id: number, updateHouseDto: UpdateHouseDto) {
    await this.findOne(id);

    try {
      const updatedHouse = await this.prisma.house.update({
        where: { id },
        data: cleanObject({
          ...updateHouseDto,
          updatedBy: updateHouseDto.updatedBy,
        }),
        include: { rooms: true, qrCode: true },
      });

      return updatedHouse;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.house.delete({ where: { id } });
  }
}
