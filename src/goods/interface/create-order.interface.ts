import { User } from "src/user/entities/user.entity";
import { Goods } from "../entities/goods.entity";

export interface CreateGoodsInterface {
    status: string;
    quantity: number;
    goods: Goods; 
    user: User;
  }