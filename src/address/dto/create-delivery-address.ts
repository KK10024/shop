import { IsBoolean, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDeliveryAddressDto {
    @ApiProperty({
        description: '받는 사람 이름',
        example: 'elice',
    })
    @IsString()
    recipientName: string;

    @ApiProperty({
        description: '핸드폰 번호',
        example: '010-1234-1234',
    })
    @IsPhoneNumber('KR', { message: '전화번호 형식이 올바르지 않습니다.' })
    phone: string;

    @ApiProperty({
        description: '주소 정보',
        example: '서울특별시 강서구',
    })
    @IsString()
    address: string;

    @ApiPropertyOptional({
        description: '기본 배송지 여부',
        example: true,
    })
    @IsBoolean()
    isDefault?: boolean;

    @ApiProperty({
        description: '유저 uuid',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsString()
    userId: string;
}