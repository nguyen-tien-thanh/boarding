import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { QRCodeService } from './qr-code.service';
import { CreateQRCodeDto, UpdateQRCodeDto } from './qr-code.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateQRCodeDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.qrCodeService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('qrCode')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.qrCodeService.findAll(filter);
    const count = await this.qrCodeService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('qrCode')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.qrCodeService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateQRCodeDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.qrCodeService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.qrCodeService.remove(data.id);
  }
}
