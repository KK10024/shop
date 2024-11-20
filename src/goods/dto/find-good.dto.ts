import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindGoods {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? value : 1), { toClassOnly: true })
  @IsInt()
  @ApiProperty({
    description: '조회할 페이지 번호 (기본값: 1)',
    example: 1, 
    required: false, 
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? value : 10), { toClassOnly: true })
  @ApiProperty({
    description: '한 페이지에 표시할 상품 수 (기본값: 10)',
    example: 10,
    required: false,
  })
  limit?: number = 10;
}