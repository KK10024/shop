import { User } from "src/user/entities/user.entity";
import { Goods } from "../entities/goods.entity";
import { DeliveryAddress } from "src/delivery-address/entities/delivery-address.entity";

export interface CreateGoodsInterface {
    status: string;
    quantity: number;
    deliveryAddress: DeliveryAddress;
    goods: Goods; 
    user: User;
  }