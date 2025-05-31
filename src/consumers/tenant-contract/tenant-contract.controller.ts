import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TenantContractService } from './tenant-contract.service';
import { CreateTenantContractDto } from './dto/create-tenant-contract.dto';
import { UpdateTenantContractDto } from './dto/update-tenant-contract.dto';

@Controller()
export class TenantContractController {
  constructor(private readonly tenantContractService: TenantContractService) {}

  @MessagePattern('createTenantContract')
  create(@Payload() createTenantContractDto: CreateTenantContractDto) {
    return this.tenantContractService.create(createTenantContractDto);
  }

  @MessagePattern('findAllTenantContract')
  findAll() {
    return this.tenantContractService.findAll();
  }

  @MessagePattern('findOneTenantContract')
  findOne(@Payload() id: number) {
    return this.tenantContractService.findOne(id);
  }

  @MessagePattern('updateTenantContract')
  update(@Payload() updateTenantContractDto: UpdateTenantContractDto) {
    return this.tenantContractService.update(updateTenantContractDto.id, updateTenantContractDto);
  }

  @MessagePattern('removeTenantContract')
  remove(@Payload() id: number) {
    return this.tenantContractService.remove(id);
  }
}
