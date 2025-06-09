import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateImageDto, UpdateImageDto } from './image.dto';
import { IFilter } from 'src/common/decorators';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    try {
      const image = await this.prisma.image.create({
        data: createImageDto,
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'image',
          resourceId: image.id,
          userId: createImageDto.createdBy,
        },
      });

      return image;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter: IFilter) {
    return await this.prisma.image.findMany({
      where: filter?.where,
      skip: filter?.skip,
      take: filter?.take,
    });
  }

  async findOne(id: number) {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });
    if (!image) throw new RpcException(new NotFoundException());
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    try {
      return await this.prisma.image.update({
        where: { id },
        data: updateImageDto,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new RpcException(new NotFoundException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.image.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new RpcException(new NotFoundException());
      throw new RpcException(new InternalServerErrorException());
    }
  }
}
