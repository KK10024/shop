import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AdminService } from "./admin.service";
import { Roles } from "src/decorator/custom-roles";


@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService){}
    @Post('menu')
    async createMenu(@Body() createMenuDto: CreateMenuDto){
        return await this.adminService.createMenu(createMenuDto);
    }
    @Get('menu')
    async findMenu() {
        return await this.adminService.findMeun()
    }
    @Get('user')
    async getNewUsers(@Query() day: number) {
        return await this.adminService.getNewUsers(day);
    }
    @Get('order/today')
    async todayOrder(){
        return await this.adminService.todayOrder();
    }
    @Get('order/total')
    async todayTotalPrice(){
        return await this.adminService.todayTotalPrice();
    }
}