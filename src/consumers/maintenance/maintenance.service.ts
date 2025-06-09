import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './maintenance.dto';
import { IFilter } from 'src/common/decorators';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    try {
      const maintenance = await this.prisma.maintenance.create({
        data: createMaintenanceDto,
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'maintenance',
          resourceId: maintenance.id,
          userId: createMaintenanceDto.createdBy,
        },
      });

      return maintenance;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.maintenance.findMany({
      where: filter?.where,
      skip: filter?.skip,
      take: filter?.take,
    });
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });
    if (!maintenance) throw new RpcException(new NotFoundException());
    return maintenance;
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    try {
      return await this.prisma.maintenance.update({
        where: { id },
        data: updateMaintenanceDto,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new RpcException(new NotFoundException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.maintenance.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new RpcException(new NotFoundException());
      throw new RpcException(new InternalServerErrorException());
    }
  }
}
