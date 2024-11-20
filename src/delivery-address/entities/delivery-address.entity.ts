import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { GoodsOrder } from "src/goods/entities/goods.order.entity";


@Entity()
export class DeliveryAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    recipientName: string;

    @Column()
    phone: string;

    @Column()
    address: string; 

    @Column({ default: false })
    isDefault: boolean; 

    @ManyToOne(() => User, (user) => user.address, { onDelete: "CASCADE" })
    user: User;

    @OneToMany(() => GoodsOrder, (orders) => orders.deliveryAddress)
    orders: GoodsOrder;
}