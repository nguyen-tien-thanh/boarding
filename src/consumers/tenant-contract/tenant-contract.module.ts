import { Module } from '@nestjs/common';
import { TenantContractService } from './tenant-contract.service';
import { TenantContractController } from './tenant-contract.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [TenantContractController],
  providers: [TenantContractService, PrismaService],
  exports: [TenantContractService],
})
export class TenantContractModule {}
