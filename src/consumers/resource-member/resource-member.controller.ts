import { BadRequestException, Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { ResourceMemberService } from './resource-member.service';
import {
  CreateResourceMemberDto,
  UpdateResourceMemberDto,
} from './resource-member.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';
import { countBuilder } from 'src/common/utils';

@Controller()
export class ResourceMemberController {
  constructor(private readonly resourceMemberService: ResourceMemberService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateResourceMemberDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.resourceMemberService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('resourceMember')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.resourceMemberService.findAll(filter);
    const count = await countBuilder('resourceMember')(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('resourceMember')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.resourceMemberService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateResourceMemberDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.resourceMemberService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.resourceMemberService.remove(data.id);
  }
}
