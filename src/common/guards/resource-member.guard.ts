import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/config/prisma.config';

export function ResourceMemberGuard(resource: string) {
  @Injectable()
  class ResourceMemberGuardMixin implements CanActivate {
    constructor(public readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const data = context.switchToRpc().getData();
      const user = data.user;
      const id = data.id;

      if (!user) throw new RpcException(new UnauthorizedException());
      if (user.username === 'admin') {
        data.allowedResourceIds = [];
        return true;
      }

      const resourceMembers = await this.prisma.resourceMember.findMany({
        where: { userId: user.id, resource },
        select: { resourceId: true },
      });

      const allowedResourceIds = resourceMembers
        .map((rm) => rm.resourceId)
        .filter((id): id is number => id !== null);

      if (allowedResourceIds.length === 0) {
        throw new RpcException(new ForbiddenException());
      }

      if (id !== undefined && !allowedResourceIds.includes(id)) {
        throw new RpcException(new ForbiddenException());
      }

      data.allowedResourceIds = allowedResourceIds;

      return true;
    }
  }

  return ResourceMemberGuardMixin;
}
