import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from './entities/menu.entity';
import { AdminService } from './admin.service';
import { AdminRepository } from './repository/admin.repository';
import { AdminController } from './admin.controller';
import { GoodsModule } from 'src/goods/goods.module';
import { UserModule } from 'src/user/user.module';
import { CustomLoggerModule } from 'src/common/custom-logger/logger.Module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    UserModule,
    GoodsModule,
    CustomLoggerModule ,    
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [
    {
      provide: 'IAdminService',
      useClass: AdminService,
    },
    AdminRepository
  ],
  exports: [AdminRepository], 
})

export class AdminModule {}