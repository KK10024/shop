import { Injectable, NotFoundException } from '@nestjs/common';
import { GoodsRepository } from './repository/goods.repository';
import { CreateGoodDto } from './dto/create-good.dto';
import { GoodsOrderRepository } from './repository/goods.order.repository';
import { FindGoods } from './dto/find-good.dto';
import { ImageService } from 'src/image/image.service';
import { CreateGoodsOrderDto } from './dto/create-order.dto';
import { UserRepository } from 'src/user/repository/user.repository';
import { DeliveryAddressRepository } from 'src/delivery-address/repository/delivery-address.repository';
import { CustomLoggerService } from 'src/common/custom-logger/logger.service';

@Injectable()
export class GoodsService {
  constructor(
    private goodsRepository: GoodsRepository,
    private goodsOrderRepository: GoodsOrderRepository,
    private userRepository: UserRepository,
    private imageService: ImageService,
    private deliveryAddressRepository: DeliveryAddressRepository,
    private logger: CustomLoggerService,
  ) {}

  // 상품 생성 비즈니스 로직
  async create(createGoodDto: CreateGoodDto, files: Express.Multer.File[]) {
    this.logger.log("상품 생성 서비스 호출")
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
    this.logger.log("모든 상품 조회 서비스 호출")
    return await this.goodsRepository.findAll(findGoods.page, findGoods.limit);
  }

  // 상품 상세 조회
  async findOne(id: number) {
    this.logger.log("상품 상세 조회 서비스 호출")

    const goods = await this.goodsRepository.findOne(id);
    if (!goods) throw new NotFoundException('상품을 찾을 수 없습니다.');
    goods.views += 1;
    this.goodsRepository.save(goods);
    return goods;
  }

  async delete(id: number) {
    this.logger.log("상품 삭제 서비스 호출")

    const goods = await this.goodsRepository.findOne(id);
    if (!goods) throw new NotFoundException('삭제할 상품이 없습니다.');
    
    await this.goodsRepository.delete(id);
  }
  async createOrder(createGoodsOrderDto: CreateGoodsOrderDto) {
    this.logger.log("상품 오더 생성 서비스 호출")

    const user = await this.userRepository.findOne(createGoodsOrderDto.userId);
    const address = await this.deliveryAddressRepository.findAddressById(createGoodsOrderDto.addressId);
  
    if (!user) {
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }
    if (!address) {
      throw new NotFoundException('배송지를 찾을 수 없습니다.');
    }
  
    // 모든 상품 검증 및 주문 생성
    const orderItems = [];
    for (const item of createGoodsOrderDto.items) {
      const goods = await this.goodsRepository.findOne(item.goodsId);
  
      if (!goods) {
        throw new NotFoundException(`상품 ID ${item.goodsId}에 해당하는 상품을 찾을 수 없습니다.`);
      }
  
      const orderItemData = {
        goods,
        quantity: item.quantity,
        user,
        address,
        status: createGoodsOrderDto.status,
      };
  
      // 각 상품별 주문 데이터 생성
      const orderItem = await this.goodsOrderRepository.createOrder(orderItemData);
      orderItems.push(orderItem);
    }
  
    return {
      message: '주문이 성공적으로 생성되었습니다.',
      orderItems,
    };
  }
  async findAllOrders(userId: string){
    this.logger.log("모든 상품 오더 조회 서비스 호출")

    return await this.goodsOrderRepository.findAllOrders(userId);
  }
  //주문 상세 조회
  async getOrderById(id: number) {
    this.logger.log(" 상품 오더 상세조회 서비스 호출")

    return await this.goodsOrderRepository.findById(id);
  }
}
