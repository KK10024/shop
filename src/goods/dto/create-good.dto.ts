import { IsString, IsOptional, IsArray, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GoodsSize } from 'src/common/enum/goods';

export class CreateGoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
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
  @IsOptional()
  size?: GoodsSize; // 선택적으로 받을 수 있도록
}

