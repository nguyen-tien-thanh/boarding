import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { House } from './entities/house.entity';
import { IFilter } from 'src/common/decorators';

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHouseDto: CreateHouseDto): Promise<House> {
    try {
      const house = await this.prisma.house.create({
        data: {
          name: createHouseDto.name,
          address: createHouseDto.address,
          ownerId: createHouseDto.ownerId,
          description: createHouseDto.description,
          totalArea: createHouseDto.totalArea,
          totalRooms: createHouseDto.totalRooms,
          createdBy: createHouseDto.createdBy,
          updatedBy: createHouseDto.createdBy,
        },
        include: {
          rooms: true,
          qrCode: true,
          images: true,
        },
      });

      return house;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'House with this information already exists',
        );
      }
      throw error;
    }
  }

  async findAll(filter: IFilter): Promise<{ data: House[]; count: number }> {
    const count = await this.prisma.house.count({ where: filter.where });
    const houses = await this.prisma.house.findMany({
      orderBy: { createdAt: 'desc', ...filter.orderBy },
      ...filter,
    });

    return { data: houses, count };
  }

  async findOne(id: number): Promise<House> {
    const house = await this.prisma.house.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            images: true,
            roomAssets: {
              include: {
                asset: true,
              },
            },
          },
        },
        qrCode: true,
        images: true,
      },
    });

    if (!house) {
      throw new NotFoundException(`House with ID ${id} not found`);
    }

    return house;
  }

  async update(id: number, updateHouseDto: UpdateHouseDto): Promise<House> {
    await this.findOne(id);

    try {
      const updatedHouse = await this.prisma.house.update({
        where: { id },
        data: {
          ...(updateHouseDto.name && { name: updateHouseDto.name }),
          ...(updateHouseDto.address && { address: updateHouseDto.address }),
          ...(updateHouseDto.ownerId && { ownerId: updateHouseDto.ownerId }),
          ...(updateHouseDto.description !== undefined && {
            description: updateHouseDto.description,
          }),
          ...(updateHouseDto.totalArea && {
            totalArea: updateHouseDto.totalArea,
          }),
          ...(updateHouseDto.totalRooms && {
            totalRooms: updateHouseDto.totalRooms,
          }),
          ...(updateHouseDto.status && { status: updateHouseDto.status }),
          updatedBy: updateHouseDto.updatedBy,
        },
        include: {
          rooms: true,
          qrCode: true,
          images: true,
        },
      });

      return updatedHouse;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'House with this information already exists',
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.prisma.house.delete({
      where: { id },
    });

    return { message: `House with ID ${id} has been successfully deleted` };
  }
}
