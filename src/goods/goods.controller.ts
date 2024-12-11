import { Controller, Get, Post, Body, Param, Delete, Query, UploadedFiles, UseGuards, Req, UseInterceptors, Inject } from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { FindGoods } from './dto/find-good.dto';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateGoodsOrderDto } from './dto/create-order.dto';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/common/guard/jwt.auth.guard ';
import { TransformInterceptor } from 'src/common/intersepter/transformation.intersepter';
import { CustomLoggerService } from 'src/common/custom-logger/logger.service';
import { IGoodsService } from './interface/goods.service.interface';

@ApiTags('Goods') 
@Controller('goods')
export class GoodsController {
  constructor(
    @Inject('IGoodsService')
    private readonly goodsService: IGoodsService,    
    private readonly logger: CustomLoggerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '새 상품을 생성합니다.' })
  @ApiBody({ type: CreateGoodDto })
  @ApiResponse({ status: 201, description: '상품이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  async create(
    @Body() createGoodDto: CreateGoodDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files, "컨트롤러");
    this.logger.log("상품 생성 컨트롤러 호출")
    return await this.goodsService.create(createGoodDto, files);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '모든 상품을 조회합니다.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '페이지당 항목 수' })
  @ApiResponse({ status: 200, description: '상품 목록', type: [CreateGoodDto] })
  async findAll(@Query() findGoods: FindGoods) {
    this.logger.log("모든 상품 조회 컨트롤러 호출")
    return await this.goodsService.findAll(findGoods);
  }
  @Post('/orders')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '상품 주문을 생성합니다.' })
  @ApiBody({ type: CreateGoodsOrderDto })
  @ApiResponse({ status: 201, description: '주문이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  async createOrder(
    @Body() createOrderDto: CreateGoodsOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {  
    this.logger.log("상품 오더 생성 컨트롤러 호출")
    const userId = req.user?.uuid;
    // console.log(createOrderDto.userId);
    return await this.goodsService.createOrder(createOrderDto, userId);
  }

  @Get('/orders')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '사용자의 모든 주문을 조회합니다.' })
  async findAllOrders(
    @Req() req: AuthenticatedRequest,
  ) {
    this.logger.log("모든 상품 오더 조회 컨트롤러 호출")
    const userId = req.user?.uuid;
    return await this.goodsService.findAllOrders(userId);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: 'ID로 상품을 조회합니다.' })
  @ApiParam({ name: 'id', type: String, description: '조회할 상품의 ID' })
  @ApiResponse({ status: 200, description: '상품 정보', type: CreateGoodDto })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없습니다.' })
  async findOne(@Param('id') id: string) {
    this.logger.log("상품 오더 상세조회 컨트롤러 호출")
    return await this.goodsService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: 'ID로 상품을 삭제합니다.' })
  @ApiParam({ name: 'id', type: String, description: '삭제할 상품의 ID' })
  @ApiResponse({ status: 200, description: '상품이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없습니다.' })
  async delete(@Param('id') id: string) {
    this.logger.log("상품 오더 삭제 컨트롤러 호출")
    return await this.goodsService.delete(+id);
  }
}