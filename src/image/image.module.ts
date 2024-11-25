import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageRepository } from "./repository/image.repository";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./entities/image.entity";
import { CustomLoggerModule } from "src/common/custom-logger/logger.Module";


@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
        CustomLoggerModule,
    ],
    providers: [
        ImageService,
        {
          provide: ImageRepository,
          useFactory: (dataSource: DataSource) => new ImageRepository(dataSource),
          inject: [DataSource],
        },
      ],
      exports: [ImageService],
})

export class ImageModule {}