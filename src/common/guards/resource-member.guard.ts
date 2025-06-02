import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';

export function ResourceMemberGuard(resource: string) {
  @Injectable()
  class ResourceMemberGuardMixin implements CanActivate {
    constructor(public readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const data = context.switchToRpc().getData();
      const user = data.user;

      if (!user) throw new ForbiddenException('User not authenticated');
      if (user.username === 'admin') return true; // TODO: Change this hardcode

      const resourceMembers = await this.prisma.resourceMember.findMany({
        where: { userId: user.id, resource },
        select: { resourceId: true },
      });

      const allowedResourceIds = resourceMembers
        .map((rm) => rm.resourceId)
        .filter((id): id is number => id !== null);

      if (allowedResourceIds.length === 0) {
        throw new ForbiddenException('No access to any resource');
      }

      data.allowedResourceIds = allowedResourceIds;

      return true;
    }
  }

  return ResourceMemberGuardMixin;
}
