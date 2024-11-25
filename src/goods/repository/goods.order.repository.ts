import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GoodsOrder } from '../entities/goods.order.entity'; // GoodsOrder 엔티티 경로 수정 필요
import { CreateGoodsInterface } from '../interface/create-order.interface';
import dayjs from 'dayjs';

@Injectable()
export class GoodsOrderRepository {
  private readonly repository: Repository<GoodsOrder>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(GoodsOrder);
  }
  async createOrder(orderData: CreateGoodsInterface) {
    const order = this.repository.create(orderData);
    return await this.repository.save(order);
  }
  async createOrders(orderDataArray: CreateGoodsInterface[]) {
    const orders = this.repository.create(orderDataArray);
    return await this.repository.save(orders);
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
        'address.address AS address',
        'goodsOrder.quantity * goods.price AS total_price',
      ])
      .leftJoin('goodsOrder.goods', 'goods')
      .leftJoin('goodsOrder.user', 'user') 
      .leftJoin('goodsOrder.deliveryAddress', 'address')
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
  async todayOrder(){
    const todayStart = dayjs().startOf('day').toDate(); 
    const todayEnd = dayjs().endOf('day').toDate(); 

    const countOrder = await this.repository
        .createQueryBuilder("order")
        .where("order.createdAt >= :start", { start: todayStart })
        .andWhere("order.createdAt <= :end", { end: todayEnd })
        .getMany();

    return countOrder;
  }
  async todayTotalPrice() {
    const startOfToday = dayjs().startOf('day').toDate();
    const endOfToday = dayjs().endOf('day').toDate();

    const todayRevenue = await this.repository
        .createQueryBuilder('goodsOrder')
        .leftJoin('goodsOrder.goods', 'goods')
        .select('SUM(goodsOrder.quantity * goods.price)', 'totalRevenue')
        .where('goodsOrder.createdAt >= :start', { start: startOfToday })
        .andWhere('goodsOrder.createdAt <= :end', { end: endOfToday })
        .andWhere('goodsOrder.deletedAt IS NULL')
        .getRawOne();

    return Number(todayRevenue.totalRevenue || 0);
  }
}