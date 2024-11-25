import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { DeliveryAddressService } from "./delivery-address.service";
import { CreateDeliveryAddressDto } from "./dto/create-delivery-address";
import { UpdateDeliveryAddressDto } from "./dto/update-delivery-address.dto";
import { AuthenticatedRequest, JwtAuthGuard } from "src/common/guard/jwt.auth.guard ";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeliveryAddress } from './entities/delivery-address.entity';
import { TransformInterceptor } from "src/common/intersepter/transformation.intersepter";
import { CustomLoggerService } from "src/common/custom-logger/logger.service";

@ApiTags('Delivery Address')  // 컨트롤러 태그
@Controller("delivery-address")
export class DeliveryAddressController {
    constructor(
        private readonly addressService: DeliveryAddressService,
        private readonly logger: CustomLoggerService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '새 배송 주소 추가' })  // API 설명
    @ApiResponse({ status: 201, description: '배송 주소가 추가되었습니다.' })
    @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
    addAddress(
        @Body() dto: CreateDeliveryAddressDto,
        @Req() req: AuthenticatedRequest
    ) {
        this.logger.log("배송지 생성 컨트롤러 호출")
        dto.userId = req.user?.uuid;
        console.log(req.user?.uuid, "userID");
        return this.addressService.addAddress(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '사용자의 모든 배송 주소 조회' })
    @ApiResponse({ status: 200, description: '사용자의 배송 주소 목록 조회 성공', type: [DeliveryAddress] })
    @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
    getAddresses(@Req() req: AuthenticatedRequest) {
        this.logger.log("모든 배송지 조회 컨트롤러 호출")
        const userId = req.user?.uuid;
        return this.addressService.getAddresses(userId);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '배송 주소 업데이트' })
    @ApiResponse({ status: 200, description: '배송 주소가 업데이트 되었습니다.' })
    @ApiResponse({ status: 404, description: '주소를 찾을 수 없습니다.' })
    updateAddress(
        @Param("id") id: number,
        @Body() dto: UpdateDeliveryAddressDto,
        @Req() req: AuthenticatedRequest
    ) {
        this.logger.log("배송지 업데이트 컨트롤러 호출")
        dto.userId = req.user?.uuid;
        return this.addressService.updateAddress(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '배송 주소 삭제' })
    @ApiResponse({ status: 200, description: '배송 주소가 삭제되었습니다.' })
    @ApiResponse({ status: 404, description: '주소를 찾을 수 없습니다.' })
    deleteAddress(@Param("id") id: number) {
        this.logger.log("배송지 삭제 컨트롤러 호출")
        return this.addressService.deleteAddress(id);
    }
}