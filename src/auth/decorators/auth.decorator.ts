import { applyDecorators, UseGuards } from '@nestjs/common/decorators';
import { OnlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

export type TypeRole = 'admin' | 'user' | undefined;

export const Auth = (role: TypeRole) =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );
