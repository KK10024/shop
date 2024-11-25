import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from './entities/menu.entity';
import { AdminService } from './admin.service';
import { AdminRepository } from './repository/admin.repository';
import { AdminController } from './admin.controller';
import { GoodsModule } from 'src/goods/goods.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    UserModule,
    GoodsModule,
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
export class AdminModule {}