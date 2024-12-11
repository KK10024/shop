import { CreateGoodDto } from "../dto/create-good.dto";
import { CreateGoodsOrderDto } from "../dto/create-order.dto";
import { FindGoods } from "../dto/find-good.dto";
import { Goods } from "../entities/goods.entity";
import { GoodsOrder } from "../entities/goods.order.entity";

export interface IGoodsService {
    create(createGoodDto: CreateGoodDto, files: Express.Multer.File[]): Promise<Goods>;
    findAll(findGoods?: FindGoods): Promise<{ data: Goods[]; totalPages: number; }>;
    findOne(id: number): Promise<Goods>;
    delete(id: number): void;
    createOrder(
        CreateGoodsOrderDto: CreateGoodsOrderDto, 
        userId: string
    ): Promise<{message: string}>;
    findAllOrders(userId: string): Promise<GoodsOrder[]>;
    getOrderById(id: number): Promise<GoodsOrder>;
}