import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.config';
import { CreateQRCodeDto, UpdateQRCodeDto } from './qr-code.dto';
import { cleanObject } from 'src/common/utils';
import { RpcException } from '@nestjs/microservices';
import { IFilter } from 'src/common/decorators';

@Injectable()
export class QRCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQRCodeDto: CreateQRCodeDto) {
    try {
      const qrCode = await this.prisma.qRCode.create({
        data: createQRCodeDto,
        include: { house: true },
      });

      await this.prisma.resourceMember.create({
        data: {
          resource: 'qrCode',
          resourceId: qrCode.id,
          userId: createQRCodeDto.createdBy,
        },
      });

      return qrCode;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll(filter?: IFilter) {
    return await this.prisma.qRCode.findMany({
      where: filter?.where,
      orderBy: { updatedAt: 'desc' },
      include: { house: true },
      skip: filter?.skip,
      take: filter?.take,
    });
  }

  async count(filter?: IFilter) {
    return await this.prisma.qRCode.count({
      where: filter?.where,
    });
  }

  async findOne(id: number) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id },
      include: { house: true },
    });

    if (!qrCode) throw new RpcException(new NotFoundException());

    return qrCode;
  }

  async update(id: number, updateQRCodeDto: UpdateQRCodeDto) {
    await this.findOne(id);

    try {
      const updatedQRCode = await this.prisma.qRCode.update({
        where: { id },
        data: cleanObject({
          ...updateQRCodeDto,
          updatedBy: updateQRCodeDto.updatedBy,
        }),
        include: { house: true },
      });

      return updatedQRCode;
    } catch (error) {
      if (error.code === 'P2002')
        throw new RpcException(new ConflictException());
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.qRCode.delete({ where: { id } });
  }
}
