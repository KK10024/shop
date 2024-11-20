import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageRepository } from "./repository/image.repository";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./entities/image.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Image])
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