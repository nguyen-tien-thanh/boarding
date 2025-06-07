import { BadRequestException, Controller, Req } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { HouseService } from './house.service';
import { CreateHouseDto, UpdateHouseDto } from './house.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateHouseDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.houseService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('house')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.houseService.findAll(filter);
    const count = await this.houseService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('house')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.houseService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateHouseDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.houseService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.houseService.remove(data.id);
  }
}
