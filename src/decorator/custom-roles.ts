import { SetMetadata } from '@nestjs/common';

// 'roles' 키에 접근할 수 있도록 메타데이터 설정
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);