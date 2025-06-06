import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateRoomAssetDto, UpdateRoomAssetDto } from './room-asset.dto';
import { IFilter } from 'src/common/decorators';
import { cleanObject } from 'src/common/utils/object.utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoomAssetService {
  constructor(private readonly prisma: PrismaService) {}

  async count(filter: IFilter) {
    const where = filter.where || {};
    const ids =
      where.id?.in ||
      (where.AND?.find((cond) => cond?.id?.in) || {}).id?.in ||
      [];
    return this.prisma.roomAsset.count({ where: { id: { in: ids } } });
  }

  async create(createRoomAssetDto: CreateRoomAssetDto) {
    try {
      const roomAsset = await this.prisma.roomAsset.create({
        data: {
          ...createRoomAssetDto,
          updatedBy: createRoomAssetDto.createdBy,
        },
        include: { room: true, asset: true },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'roomAsset',
          resourceId: roomAsset.id,
          userId: createRoomAssetDto.createdBy,
        },
      });

      return roomAsset;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.roomAsset.findMany({
      orderBy: { updatedAt: 'desc', ...filter.orderBy },
      ...filter,
    });
  }

  async findOne(id: number) {
    const roomAsset = await this.prisma.roomAsset.findUnique({
      where: { id },
      include: { room: true, asset: true },
    });

    if (!roomAsset) throw new RpcException(new NotFoundException());

    return roomAsset;
  }

  async update(id: number, updateRoomAssetDto: UpdateRoomAssetDto) {
    await this.findOne(id);

    try {
      const updatedRoomAsset = await this.prisma.roomAsset.update({
        where: { id },
        data: cleanObject({
          ...updateRoomAssetDto,
          updatedBy: updateRoomAssetDto.updatedBy,
        }),
        include: { room: true, asset: true },
      });

      return updatedRoomAsset;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.roomAsset.delete({ where: { id } });
  }
}
