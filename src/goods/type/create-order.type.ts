import { User } from "src/user/entities/user.entity";
import { Goods } from "../entities/goods.entity"
import { Address } from "src/address/entities/address.entity";

export type CreateOrder = {
    goods: Goods;
    quantity: number;
    user: User;
    address: Address;
    status: string;
}