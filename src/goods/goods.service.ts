import { Injectable, NotFoundException } from '@nestjs/common';
import { GoodsRepository } from './repository/goods.repository';
import { CreateGoodDto } from './dto/create-good.dto';
import { GoodsOrderRepository } from './repository/goods.order.repository';
import { FindGoods } from './dto/find-good.dto';
import { GoodsOrder } from './entities/goods.order.entity';
import { ImageService } from 'src/image/image.service';
import { CreateGoodsOrderDto } from './dto/create-order.dto';
import { UserRepository } from 'src/user/repository/user.repository';
import { CreateGoodsInterface } from './interface/create-order.interface';
import { DeliveryAddressRepository } from 'src/delivery-address/repository/delivery-address.repository';

@Injectable()
export class GoodsService {
  constructor(
    private goodsRepository: GoodsRepository,
    private goodsOrderRepository: GoodsOrderRepository,
    private userRepository: UserRepository,
    private readonly imageService: ImageService,
    private readonly deliveryAddressRepository: DeliveryAddressRepository,

  ) {}

  // 상품 생성 비즈니스 로직
  async create(createGoodDto: CreateGoodDto, files: Express.Multer.File[]) {
    // 상품 데이터 저장 로직
    const savedGood = await this.goodsRepository.create(createGoodDto);

    // 파일이 있다면 이미지 저장 서비스 호출
    if (files && files.length > 0) {
      await this.imageService.saveImages(files, 'PRODUCT', savedGood.id);
    }

    return savedGood;
  }
  // 상품 목록 조회
  async findAll(findGoods?: FindGoods) {
    return await this.goodsRepository.findAll(findGoods.page, findGoods.limit);
  }

  // 상품 상세 조회
  async findOne(id: number) {
    const goods = await this.goodsRepository.findOne(id);
    if (!goods) throw new NotFoundException('상품을 찾을 수 없습니다.');
    
    return goods;
  }

  async delete(id: number) {
    const goods = await this.goodsRepository.findOne(id);
    if (!goods) throw new NotFoundException('삭제할 상품이 없습니다.');
    
    await this.goodsRepository.delete(id);
  }
  async createOrder(createGoodsOrderDto: CreateGoodsOrderDto) {
    const goods = await this.goodsRepository.findOne(createGoodsOrderDto.goodsId);
    const user = await this.userRepository.findOne(createGoodsOrderDto.userId);
    const deliveryAddress = await this.deliveryAddressRepository.findUserAddresses(createGoodsOrderDto.userId);
    
    if (!deliveryAddress) {
      throw new NotFoundException('배송지를 찾을 수 없습니다.');
    }
    if (!goods || !user) {
      throw new NotFoundException('상품 또는 사용자가 존재하지 않습니다.');
    }
    const goodsOrderData: CreateGoodsInterface = {
      status: createGoodsOrderDto.status,
      quantity: createGoodsOrderDto.quantity,
      goods,
      user
    };
    return this.goodsOrderRepository.createOrder(goodsOrderData);
  }
  async findAllOrders(userId: string){
    return this.goodsOrderRepository.findAllOrders(userId);
  }
  // 특정 주문 조회
  // async getOrderById(id: number): Promise<GoodsOrder | null> {
  //   return this.goodsOrderRepository.findById(id); // findById 메서드를 호출하여 주문 조회
  // }
}
