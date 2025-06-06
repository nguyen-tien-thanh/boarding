import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateRoomDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.roomService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('room')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.roomService.findAll(filter);
    const count = await this.roomService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('room')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.roomService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateRoomDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.roomService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.roomService.remove(data.id);
  }
}
