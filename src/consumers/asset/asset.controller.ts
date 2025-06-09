import { BadRequestException, Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { AssetService } from './asset.service';
import { CreateAssetDto, UpdateAssetDto } from './asset.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';
import { countBuilder } from 'src/common/utils';

@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateAssetDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.assetService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('asset')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.assetService.findAll(filter);
    const count = await countBuilder('asset')(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('asset')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.assetService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateAssetDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.assetService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.assetService.remove(data.id);
  }
}
