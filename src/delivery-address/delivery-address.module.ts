import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { DeliveryAddress } from './entities/delivery-address.entity';
import { DeliveryAddressController } from './delivery-address.controller';
import { DeliveryAddressService } from './delivery-address.service';
import { DeliveryAddressRepository } from './repository/delivery-address.repository';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CustomLoggerModule } from 'src/common/custom-logger/logger.Module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryAddress]), 
    UserModule,
    CustomLoggerModule,
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
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
