import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { TenantContractService } from './tenant-contract.service';
import {
  CreateTenantContractDto,
  UpdateTenantContractDto,
} from './tenant-contract.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class TenantContractController {
  constructor(private readonly tenantContractService: TenantContractService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateTenantContractDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.tenantContractService.create({
      ...data.payload,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('tenantContract')
  async findAll() {
    return this.tenantContractService.findAll();
  }

  @AutoRpcPattern()
  @ResourceMember('tenantContract')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.tenantContractService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateTenantContractDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException('Invalid payload or user data');
    }
    return this.tenantContractService.update(data.id, data.payload);
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException('Invalid payload or user data');
    return this.tenantContractService.remove(data.id);
  }
}
