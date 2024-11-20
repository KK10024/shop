import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GoodsOrder } from "src/goods/entities/goods.order.entity";
import { DeliveryAddress } from "src/delivery-address/entities/delivery-address.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    
    @Column()
    name: string;
    
    @Column()
    email: string;
    
    @Column()
    password: string;
    
    @Column()
    gender: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date; 
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null; 

    @OneToMany(() => DeliveryAddress, (address) => address.user, { cascade: true })
    address: DeliveryAddress[];

    @OneToMany(() => GoodsOrder, (order)=> order.user)
    order: GoodsOrder[];
}
