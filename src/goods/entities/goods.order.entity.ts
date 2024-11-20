import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Goods } from "./goods.entity";
import { User } from "src/user/entities/user.entity";
import { DeliveryAddress } from "src/delivery-address/entities/delivery-address.entity";

@Entity()
export class GoodsOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;
    
    @Column()
    quantity: number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date; 
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null; 

    @ManyToOne(() => Goods, goods => goods.order, { eager: true }) 
    @JoinColumn({ name: 'goodsId' })
    goods: Goods;

    @ManyToOne(() => User, user => user.order, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;
    
    @ManyToOne(() => DeliveryAddress, (deliveryAddress) => deliveryAddress.orders)
    deliveryAddress: DeliveryAddress;
}