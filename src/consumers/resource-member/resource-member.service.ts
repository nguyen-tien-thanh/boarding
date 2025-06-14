import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import {
  CreateResourceMemberDto,
  UpdateResourceMemberDto,
} from './resource-member.dto';
import { IFilter } from 'src/common/decorators';
import { cleanObject } from 'src/common/utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ResourceMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateResourceMemberDto) {
    try {
      return await this.prisma.resourceMember.create({
        data: {
          resource: data.resource,
          resourceId: data.resourceId,
          userId: data.userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new RpcException(
          new ConflictException('Resource member already exists'),
        );
      }
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.resourceMember.findMany({
      where: filter?.where,
      skip: filter?.skip,
      take: filter?.take,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const resourceMember = await this.prisma.resourceMember.findUnique({
      where: { id },
    });

    if (!resourceMember) {
      throw new RpcException(
        new NotFoundException('Resource member not found'),
      );
    }

    return resourceMember;
  }

  async update(id: number, data: UpdateResourceMemberDto) {
    try {
      return await this.prisma.resourceMember.update({
        where: { id },
        data: cleanObject(data),
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new RpcException(
          new NotFoundException('Resource member not found'),
        );
      }
      if (error.code === 'P2002') {
        throw new RpcException(
          new ConflictException('Resource member already exists'),
        );
      }
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.resourceMember.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new RpcException(
          new NotFoundException('Resource member not found'),
        );
      }
      throw new RpcException(new InternalServerErrorException());
    }
  }
}
