import { BadRequestException, Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { AssetCategoryService } from './asset-category.service';
import {
  CreateAssetCategoryDto,
  UpdateAssetCategoryDto,
} from './asset-category.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class AssetCategoryController {
  constructor(private readonly assetCategoryService: AssetCategoryService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateAssetCategoryDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.assetCategoryService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('assetCategory')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.assetCategoryService.findAll(filter);
    const count = await this.assetCategoryService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('assetCategory')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.assetCategoryService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateAssetCategoryDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.assetCategoryService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.assetCategoryService.remove(data.id);
  }
}
