import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoodsOrderDto {
  @IsString()
  @ApiProperty({
    description: '주문 상태',
    example: 'pending',
  })
  status: string;
  @IsNumber()
  @ApiProperty({
    description: '주소 ID',
  })
  @ApiProperty({
    description: 'userId',
  })
  userId: string;
  @ApiProperty({
    description: '배송지 ID',
  })
  addressId: number;
  items: {
    goodsId: number;
    quantity: number;
  }[];
}