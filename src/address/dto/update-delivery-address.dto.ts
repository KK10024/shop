import { IsOptional, IsBoolean, IsPhoneNumber, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateDeliveryAddressDto {
    @ApiPropertyOptional({
        description: '받는 사람 이름',
        example: 'elice',
    })
    @IsOptional()
    @IsString()
    recipientName?: string;

    @ApiPropertyOptional({
        description: '핸드폰 번호',
        example: '010-1234-1234',
    })
    @IsOptional()
    @IsPhoneNumber('KR', {
        message: '전화번호 형식이 올바르지 않습니다.',
    })
    phone?: string;

    @ApiPropertyOptional({
        description: '배송지 정보',
        example: '서울특별시 강서구',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        description: '기본 배송지 여부',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({
        description: '유저 uuid',
        example: 'a23b4cde-12f3-4567-89ab-cdef12345678',
    })
    @IsString()
    userId: string;
}