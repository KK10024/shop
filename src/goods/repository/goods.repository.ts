import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryBuilder, Repository } from 'typeorm';
import { Goods } from '../entities/goods.entity';
import { CreateGoodDto } from '../dto/create-good.dto';

@Injectable()
export class GoodsRepository {
  private readonly repository: Repository<Goods>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Goods);
  }

  // 상품 생성
  async create(goods: CreateGoodDto): Promise<Goods> {
    return await this.repository.save(goods);
  }

  async findAll(page: number, limit: number): Promise<{ data: Goods[], totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, totalCount]: [Goods[], number] = await this.repository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.images', 'image', 'image.type = :type', { type: 'PRODUCT' })
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit); 
    return {
      data,
      totalPages,
    };
  }

  // 특정 상품 조회
  async findOne(id: number): Promise<Goods | null> {
    return await this.repository.findOne({ where: { id } });
  }

  // 상품 삭제
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  //트랜잭션 매니저
  async createWithTransaction(goods: CreateGoodDto, manager: EntityManager,
  ): Promise<Goods> {
    return await manager.save(Goods, goods);
  }
}