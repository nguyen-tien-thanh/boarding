import { BadRequestException, Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { ImageService } from './image.service';
import { CreateImageDto, UpdateImageDto } from './image.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateImageDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.imageService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('image')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.imageService.findAll(filter);
    const count = await this.imageService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('image')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.imageService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateImageDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.imageService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.imageService.remove(data.id);
  }
}
