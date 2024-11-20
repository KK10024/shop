import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GoodsOrder } from '../entities/goods.order.entity'; // GoodsOrder 엔티티 경로 수정 필요
import { CreateGoodsInterface } from '../interface/create-order.interface';

@Injectable()
export class GoodsOrderRepository {
  private readonly repository: Repository<GoodsOrder>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(GoodsOrder);
  }

  async createOrder(goodsOrderData: CreateGoodsInterface) {  

    const goodsOrder = this.repository.create({
      status: goodsOrderData.status,
      quantity: goodsOrderData.quantity,
      goods: goodsOrderData.goods,
      user: goodsOrderData.user,
    }); 
    return await this.repository.save(goodsOrder); 
  }
  async findAllOrders(userId: string): Promise<GoodsOrder[]> {
    return this.repository
      .createQueryBuilder('goodsOrder')
      .select([
        'goodsOrder.id AS goodsOrder_id',
        'goodsOrder.status AS goodsOrder_status',
        'goodsOrder.createdAt AS goodsOrder_createdAt',
        'goodsOrder.quantity AS goodsOrder_quantity',
        'goods.id AS goods_id',
        'goods.name AS goods_name',
        'goods.price AS goods_price',
        'user.name AS user_name',
        'goodsOrder.quantity * goods.price AS total_price',
      ])
      .leftJoin('goodsOrder.goods', 'goods')
      .leftJoin('goodsOrder.user', 'user') 
      .where('user.uuid = :userId', { userId }) 
      .getRawMany(); 
  }
  async findById(id: number): Promise<GoodsOrder | null> {
    const queryBuilder = this.repository.createQueryBuilder('goodsOrder')
      .leftJoinAndSelect('goodsOrder.user', 'user')
      .leftJoinAndSelect('goodsOrder.goods', 'goods')
      .leftJoinAndSelect('goodsOrder.deliveryAddress', 'deliveryAddress')
      .where('goodsOrder.id = :id', { id });

    return await queryBuilder.getOne();
  }
}