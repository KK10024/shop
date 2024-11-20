import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { DeliveryAddress } from './entities/delivery-address.entity';
import { DeliveryAddressController } from './delivery-address.controller';
import { DeliveryAddressService } from './delivery-address.service';
import { DeliveryAddressRepository } from './repository/delivery-address.repository';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryAddress]), 
    UserModule,
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ], // User 모듈 의존성 추가
  controllers: [DeliveryAddressController],
  providers: [
    DeliveryAddressService,
    {
        provide: DeliveryAddressRepository,
        useFactory: (dataSource: DataSource) => new DeliveryAddressRepository(dataSource),
        inject: [DataSource],
    },
  ],
  exports: [DeliveryAddressRepository],
})

export class AddressModule {}
