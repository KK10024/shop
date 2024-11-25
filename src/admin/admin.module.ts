import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from './entities/menu.entity';
import { AdminService } from './admin.service';
import { AdminRepository } from './repository/admin.repository';
import { AdminController } from './admin.controller';
import { UserRepository } from 'src/user/repository/user.repository';
import { GoodsOrderRepository } from 'src/goods/repository/goods.order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    UserRepository,
    GoodsOrderRepository,
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: AdminRepository,
      useFactory: (dataSource: DataSource) => new AdminRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [AdminRepository], 
})
export class UserModule {}