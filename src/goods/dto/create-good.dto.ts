import { IsString, IsOptional, IsArray, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GoodsSize } from 'src/common/enum/goods';

export class CreateGoodDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '상품 이름',
    example: "테스트 상품",
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '상품 설명',
    example: "테스트 상품입니다",
  })
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '상품가격',
    example: 10000,
  })
  price: number;

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

  @IsEnum(GoodsSize)
  @ApiProperty({
    description: '상품 이름',
    example: GoodsSize.MEDIUM,
  })
  @IsOptional()
  size?: GoodsSize; // 선택적으로 받을 수 있도록
}

