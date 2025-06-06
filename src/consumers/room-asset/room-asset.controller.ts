import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { RoomAssetService } from './room-asset.service';
import { CreateRoomAssetDto, UpdateRoomAssetDto } from './room-asset.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class RoomAssetController {
  constructor(private readonly roomAssetService: RoomAssetService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateRoomAssetDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.roomAssetService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('roomAsset')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.roomAssetService.findAll(filter);
    const count = await this.roomAssetService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('roomAsset')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.roomAssetService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateRoomAssetDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.roomAssetService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.roomAssetService.remove(data.id);
  }
}
