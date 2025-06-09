import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';
import { IFilter } from 'src/common/decorators';
import { cleanObject } from 'src/common/utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room = await this.prisma.room.create({
        data: createRoomDto,
        include: {
          roomAssets: { include: { asset: true } },
          tenantContracts: true,
          maintenances: true,
        },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'room',
          resourceId: room.id,
          userId: createRoomDto.createdBy,
        },
      });

      return room;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.room.findMany({
      orderBy: { updatedAt: 'desc', ...filter.orderBy },
      ...filter,
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        roomAssets: { include: { asset: true } },
        tenantContracts: true,
        maintenances: true,
      },
    });

    if (!room) throw new RpcException(new NotFoundException());

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);

    try {
      const updatedRoom = await this.prisma.room.update({
        where: { id },
        data: cleanObject({
          ...updateRoomDto,
          updatedBy: updateRoomDto.updatedBy,
        }),
        include: {
          roomAssets: { include: { asset: true } },
          tenantContracts: true,
          maintenances: true,
        },
      });

      return updatedRoom;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.room.delete({ where: { id } });
  }
}
