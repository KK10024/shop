import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GoodsOrder } from "./goods.order.entity";
import { Image } from "src/image/entities/image.entity";
import { GoodsSize } from "src/common/enum/goods";

@Entity()
export class Goods {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    content: string;

    @Column()
    price: number;

    @Column({
        type: 'enum',
        enum: GoodsSize,
        default: GoodsSize.MEDIUM
    })
    size: GoodsSize;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date; 
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null; 

    @OneToMany(() => Image, (image) => image.goods)  // 상품과 관련된 이미지들
    images: Image[];

    @OneToMany(() => GoodsOrder, goodsOrder => goodsOrder.goods)
    order: GoodsOrder[];
}
