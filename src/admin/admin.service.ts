import { UserRepository } from "src/user/repository/user.repository";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AdminRepository } from "./repository/admin.repository";
import { GoodsOrderRepository } from "src/goods/repository/goods.order.repository";
import { GoodsRepository } from "src/goods/repository/goods.repository";
import { CustomLoggerService } from "src/common/custom-logger/logger.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AdminService{
    constructor(
        private adminRepository: AdminRepository,
        private userRepository: UserRepository,
        private goodsOrderRepository: GoodsOrderRepository,
        private goodsRepository: GoodsRepository,
        private logger: CustomLoggerService,

    ){}
    async createMenu(createMenuDto: CreateMenuDto){
         this.logger.log("관리자 메뉴 생성 서비스 호출")
        return await this.adminRepository.createMenu(createMenuDto);
    }
    async findMeun(){
        this.logger.log("관리자 메뉴 조회 서비스 호출")
        return await this.adminRepository.findMenu();
    }
    async getNewUsers(day: number){
        this.logger.log("관리자 새로운 유저 조회 서비스 호출")
        return await this.userRepository.getNewUsers(day);
    }
    async todayOrder(){
        this.logger.log("관리자 오늘의 주문 서비스 호출")
        return await this.goodsOrderRepository.todayOrder();
    }
    async todayTotalPrice(){
        this.logger.log("관리자 오늘의 총 매출 서비스 호출")
        return await this.goodsOrderRepository.todayTotalPrice();
    }
    async getTopViewsGoods(){
        this.logger.log("관리자 많이 조회된 상품 서비스 호출")
        return await this.goodsRepository.getTopViewGoods();
    }
}