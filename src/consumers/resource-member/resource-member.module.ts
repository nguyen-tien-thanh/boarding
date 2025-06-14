import { Module } from '@nestjs/common';
import { ResourceMemberService } from './resource-member.service';
import { ResourceMemberController } from './resource-member.controller';
import { PrismaService } from '../../config/prisma.config';

@Module({
  controllers: [ResourceMemberController],
  providers: [ResourceMemberService, PrismaService],
  exports: [ResourceMemberService],
})
export class ResourceMemberModule {}
