import { User } from "src/user/entities/user.entity";
import { Goods } from "../entities/goods.entity"
import { DeliveryAddress } from "src/delivery-address/entities/delivery-address.entity";

export type CreateOrder = {
    goods: Goods;
    quantity: number;
    user: User;
    deliveryAddress: DeliveryAddress;
    status: string;
}