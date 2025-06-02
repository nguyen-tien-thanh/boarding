import { applyDecorators, UseGuards } from '@nestjs/common';
import { ResourceMemberGuard } from '../guards';

export function ResourceMember(resource: string) {
  return applyDecorators(UseGuards(ResourceMemberGuard(resource)));
}
