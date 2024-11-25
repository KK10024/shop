import { UserRepository } from "src/user/repository/user.repository";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AdminRepository } from "./repository/admin.repository";
import { GoodsOrderRepository } from "src/goods/repository/goods.order.repository";
import { GoodsRepository } from "src/goods/repository/goods.repository";


export class AdminService {
    constructor(
        private adminRepository: AdminRepository,
        private userRepository: UserRepository,
        private goodsOrderRepository: GoodsOrderRepository,
        private goodsRepository: GoodsRepository
        ){}
    async createMenu(createMenuDto: CreateMenuDto){
        return await this.adminRepository.createMeun(createMenuDto);
    }
    async findMeun(){
        return await this.adminRepository.findMeun();
    }
    async getNewUsers(day: number){
        return await this.userRepository.getNewUsers(day);
    }
    async todayOrder(){
        return await this.goodsOrderRepository.todayOrder();
    }
    async todayTotalPrice(){
        return await this.goodsOrderRepository.todayTotalPrice();
    }
    async getTopViewsGoods(){
        return await this.goodsRepository.getTopViewGoods();
    }
}