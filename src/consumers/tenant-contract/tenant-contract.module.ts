import { Module } from '@nestjs/common';
import { TenantContractService } from './tenant-contract.service';
import { TenantContractController } from './tenant-contract.controller';

@Module({
  controllers: [TenantContractController],
  providers: [TenantContractService],
})
export class TenantContractModule {}
