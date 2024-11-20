import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoodDto {
  @IsString()
  @ApiProperty({
    description: '상품 이름',
    example: '상품이름',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: '상품 설명',
    example: '그냥저냥 바지입니다',
  })
  content: string;

  @IsString()
  @ApiProperty({
    description: '상품 가격',
    example: '1000',
  })
  price: number;

  @IsString()
  @ApiProperty({
    description: '상품의 크기',
    example: 'L',
  })
  size: string;

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  @ApiProperty({
    description: '상품 이미지 파일',
    type: [String],
    example: ['/path/to/file1.jpg', '/path/to/file2.jpg'],
    required: false,
  })
  files?: string[];
  
  @IsString()
  @ApiProperty({
    description: '상품 종류',
    example: 'PRODUCT',
  })
  type: string;
}
