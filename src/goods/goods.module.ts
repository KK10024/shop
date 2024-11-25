import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { Goods } from './entities/goods.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsRepository } from './repository/goods.repository';
import { DataSource } from 'typeorm';
import { GoodsOrder } from './entities/goods.order.entity';
import { GoodsOrderRepository } from './repository/goods.order.repository';
import { ImageModule } from 'src/image/image.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AddressModule } from 'src/delivery-address/delivery-address.module';
import { CustomLoggerModule } from 'src/common/custom-logger/logger.Module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Goods, GoodsOrder]),
    ImageModule,
    UserModule,
    AddressModule,
    CustomLoggerModule,
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GoodsController],
  providers: [
    GoodsService, 
    {
      provide: GoodsRepository,
      useFactory: (dataSource: DataSource) => new GoodsRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: GoodsOrderRepository,
      useFactory: (dataSource: DataSource) => new GoodsOrderRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class GoodsModule {}
