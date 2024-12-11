import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { DeliveryAddressController } from './address.controller';
import { AddressRepository } from './repository/address.repository';
import { JwtModule } from '@nestjs/jwt';
import { CustomLoggerModule } from 'src/common/custom-logger/logger.Module';
import { Address } from './entities/address.entity';
import { AddressService } from './address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]), 
    UserModule,
    CustomLoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [DeliveryAddressController],
  providers: [
    AddressService,
    AddressRepository
  ],
  exports: [AddressRepository],
})

export class AddressModule {}
