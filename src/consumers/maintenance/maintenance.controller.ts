import { BadRequestException, Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './maintenance.dto';
import {
  AutoRpcPattern,
  IFilter,
  ResourceMember,
  ResourceFilter,
} from 'src/common/decorators';
import { IPayload } from 'src/config/rabbitmq.config';

@Controller()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @AutoRpcPattern()
  async create(@Payload() data: IPayload<CreateMaintenanceDto>) {
    if (!data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.maintenanceService.create({
      ...data.payload,
      reportedBy: data.user.id,
      createdBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  @ResourceMember('maintenance')
  async findAll(@ResourceFilter() filter: IFilter) {
    const data = await this.maintenanceService.findAll(filter);
    const count = await this.maintenanceService.count(filter);
    return { data, count };
  }

  @AutoRpcPattern()
  @ResourceMember('maintenance')
  async findOne(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.maintenanceService.findOne(data.id);
  }

  @AutoRpcPattern()
  async update(@Payload() data: IPayload<UpdateMaintenanceDto>) {
    if (!data.id || !data.payload || !data.user) {
      throw new RpcException(new BadRequestException());
    }
    return this.maintenanceService.update(data.id, {
      ...data.payload,
      updatedBy: data.user.id,
    });
  }

  @AutoRpcPattern()
  async remove(@Payload() data: IPayload) {
    if (!data.id) throw new RpcException(new BadRequestException());
    return this.maintenanceService.remove(data.id);
  }
}
