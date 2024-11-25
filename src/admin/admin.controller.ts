import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from "@nestjs/swagger";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AdminService } from "./admin.service";
import { Roles } from "src/decorator/custom-roles";
import { CustomLoggerService } from "src/common/custom-logger/logger.service";
import { RolesGuard } from "src/common/guard/roles.guard";
import { JwtAuthGuard } from "src/common/guard/jwt.auth.guard ";
import { TransformInterceptor } from "src/common/intersepter/transformation.intersepter";

@ApiTags('Admin') 
@Controller('admin')
@Roles('ADMIN')
@UseGuards(RolesGuard, JwtAuthGuard)
export class AdminController {
    constructor(
        private adminService: AdminService,
        private logger: CustomLoggerService,
    ) {}

    @Post('menu')
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '메뉴 생성', description: '새로운 메뉴 항목을 데이터베이스에 추가합니다.' })
    @ApiBody({ type: CreateMenuDto, description: '메뉴 생성에 필요한 데이터' })
    @ApiResponse({ status: 201, description: '메뉴 항목이 성공적으로 생성되었습니다.' })
    @ApiResponse({ status: 400, description: '잘못된 데이터가 제공되었습니다.' })
    async createMenu(@Body() createMenuDto: CreateMenuDto) {
        this.logger.log("관리자 메뉴 생성 컨트롤러 호출")
        return await this.adminService.createMenu(createMenuDto);
    }

    @Get('menu')
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '전체 메뉴 조회', description: '데이터베이스에서 모든 메뉴 항목을 가져옵니다.' })
    @ApiResponse({ status: 200, description: '메뉴 항목 목록이 반환됩니다.' })
    async findMenu() {
        this.logger.log("관리자 메뉴 조회 컨트롤러 호출")
        return await this.adminService.findMeun();
    }

    @Get('user/new')
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '신규 사용자 수 조회', description: '지정된 기간 내에 가입한 신규 사용자의 수를 반환합니다.' })
    @ApiQuery({ name: 'day', type: Number, description: '조회할 기간(일 단위)', required: true, example: 7 })
    @ApiResponse({ status: 200, description: '신규 사용자 수가 반환됩니다.' })
    @ApiResponse({ status: 400, description: '잘못된 쿼리 매개변수입니다.' })
    async getNewUsers(@Query('day') day: number) {
        this.logger.log("관리자 신규 유저 조회 컨트롤러 호출")
        return await this.adminService.getNewUsers(day);
    }

    @Get('order/today')
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '오늘의 주문 조회', description: '오늘 발생한 모든 주문을 조회합니다.' })
    @ApiResponse({ status: 200, description: '오늘의 주문 목록이 반환됩니다.' })
    async todayOrder() {
        this.logger.log("관리자 오늘의 주문 조회 컨트롤러 호출")
        return await this.adminService.todayOrder();
    }

    @Get('order/total')
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '오늘의 총 주문 금액 조회', description: '오늘 발생한 주문의 총 금액을 조회합니다.' })
    @ApiResponse({ status: 200, description: '오늘의 총 주문 금액이 반환됩니다.' })
    async todayTotalPrice() {
        this.logger.log("관리자 오늘의 총 매출 조회 컨트롤러 호출")
        return await this.adminService.todayTotalPrice();
    }
    @Get('goods/top-views')
    @UseInterceptors(TransformInterceptor)
    @ApiOperation({ summary: '가장 많이 조회 된 상품', description: '가장 많이 조회된 상품들을 조회합니다.' })
    @ApiResponse({ status: 200, description: '가장 많이 조회된 상품들을 조회합니다.' })
    async getTopViewsGoods(){
        this.logger.log("관리자 Goods views 컨트롤러 호출")
        return await this.adminService.getTopViewsGoods();
    }
}