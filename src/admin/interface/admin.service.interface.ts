import { User } from "src/user/entities/user.entity";
import { CreateMenuDto } from "../dto/create-menu.dto";
import { Menu } from "../entities/menu.entity";
import { GoodsOrder } from "src/goods/entities/goods.order.entity";
import { Goods } from "src/goods/entities/goods.entity";

export interface IAdminService {
    createMenu(createMenuDto: CreateMenuDto): Promise<Menu>;
    findMeun(): Promise<Menu[]>;
    getNewUsers(day: number): Promise<User[]>;
    todayOrder(): Promise<GoodsOrder[]>;
    todayTotalPrice(): Promise<number>;
    getTopViewsGoods():Promise<Goods[]>;
}