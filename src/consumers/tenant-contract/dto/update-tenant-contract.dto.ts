import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantContractDto } from './create-tenant-contract.dto';

export class UpdateTenantContractDto extends PartialType(CreateTenantContractDto) {
  id: number;
}
