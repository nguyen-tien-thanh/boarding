import { Injectable } from '@nestjs/common';
import { CreateTenantContractDto } from './dto/create-tenant-contract.dto';
import { UpdateTenantContractDto } from './dto/update-tenant-contract.dto';

@Injectable()
export class TenantContractService {
  create(createTenantContractDto: CreateTenantContractDto) {
    return 'This action adds a new tenantContract';
  }

  findAll() {
    return `This action returns all tenantContract`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenantContract`;
  }

  update(id: number, updateTenantContractDto: UpdateTenantContractDto) {
    return `This action updates a #${id} tenantContract`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenantContract`;
  }
}
