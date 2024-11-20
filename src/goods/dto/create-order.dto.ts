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
  @Min(1)
  @ApiProperty({
    description: '상품수량',
    example: '1',
  })
  quantity:number;

  @ApiProperty({
    description: '주문한 상품 ID',
  })
  goodsId: number;

  @ApiProperty({
    description: 'userId',
  })
  userId: string;

  @ApiProperty({
    description: '배송지 ID',
  })
  deliveryAddressId: number;

}