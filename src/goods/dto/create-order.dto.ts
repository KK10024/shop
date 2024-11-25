import { IsEmpty, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoodsOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '주문 상태',
    example: 'pending',
  })
  status: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '주소 ID',
  })
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '배송지 ID',
  })
  addressId: number;
  items: {
    goodsId: number;
    quantity: number;
  }[];
}