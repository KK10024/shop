import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from "@nestjs/swagger";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AdminService } from "./admin.service";
import { Roles } from "src/decorator/custom-roles";

@ApiTags('Admin') 
@Controller('admin')
@Roles('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Post('menu')
    @ApiOperation({ summary: '메뉴 생성', description: '새로운 메뉴 항목을 데이터베이스에 추가합니다.' })
    @ApiBody({ type: CreateMenuDto, description: '메뉴 생성에 필요한 데이터' })
    @ApiResponse({ status: 201, description: '메뉴 항목이 성공적으로 생성되었습니다.' })
    @ApiResponse({ status: 400, description: '잘못된 데이터가 제공되었습니다.' })
    async createMenu(@Body() createMenuDto: CreateMenuDto) {
        return await this.adminService.createMenu(createMenuDto);
    }

    @Get('menu')
    @ApiOperation({ summary: '전체 메뉴 조회', description: '데이터베이스에서 모든 메뉴 항목을 가져옵니다.' })
    @ApiResponse({ status: 200, description: '메뉴 항목 목록이 반환됩니다.' })
    async findMenu() {
        return await this.adminService.findMeun();
    }

    @Get('user')
    @ApiOperation({ summary: '신규 사용자 수 조회', description: '지정된 기간 내에 가입한 신규 사용자의 수를 반환합니다.' })
    @ApiQuery({ name: 'day', type: Number, description: '조회할 기간(일 단위)', required: true, example: 7 })
    @ApiResponse({ status: 200, description: '신규 사용자 수가 반환됩니다.' })
    @ApiResponse({ status: 400, description: '잘못된 쿼리 매개변수입니다.' })
    async getNewUsers(@Query('day') day: number) {
        return await this.adminService.getNewUsers(day);
    }

    @Get('order/today')
    @ApiOperation({ summary: '오늘의 주문 조회', description: '오늘 발생한 모든 주문을 조회합니다.' })
    @ApiResponse({ status: 200, description: '오늘의 주문 목록이 반환됩니다.' })
    async todayOrder() {
        return await this.adminService.todayOrder();
    }

    @Get('order/total')
    @ApiOperation({ summary: '오늘의 총 주문 금액 조회', description: '오늘 발생한 주문의 총 금액을 조회합니다.' })
    @ApiResponse({ status: 200, description: '오늘의 총 주문 금액이 반환됩니다.' })
    async todayTotalPrice() {
        return await this.adminService.todayTotalPrice();
    }
}