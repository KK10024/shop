import { Goods } from 'src/goods/entities/goods.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column({ type: 'enum', enum: ['PRODUCT', 'USER', 'CATEGORY'], default: 'PRODUCT' })
  type: 'PRODUCT' | 'USER' | 'CATEGORY';

  @Column({ type: 'int' })
  entityId: number;  // 외래 키 역할

  @ManyToOne(() => Goods, (goods) => goods.images)
  @JoinColumn({ name: 'entityId', referencedColumnName: 'id' }) 
  goods: Goods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date; 

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null; 
}