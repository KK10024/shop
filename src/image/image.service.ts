import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { ImageRepository } from './repository/image.repository';
import { CustomLoggerService } from 'src/common/custom-logger/logger.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly logger: CustomLoggerService,) {}

  async saveImages(
    files: Express.Multer.File[],
    type: 'PRODUCT' | 'USER' | 'CATEGORY',
    id: number
  ) {
    this.logger.log("이미지 생성 서비스 호출")
    if (!files || files.length === 0) {
      console.log('No files to save');
      return;
    }
    const fileData = files.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      entityId: id,
      type: type,
    }));

    return await this.imageRepository.createAndSaveImages(fileData);
  }

  async deleteImage(id: number): Promise<void> {
    this.logger.log("이미지 삭제 서비스 호출")
    const image = await this.imageRepository.findById(id);
    if (image) {
      try {
        unlinkSync(image.path);
        await this.imageRepository.deleteById(id);
      } catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    }
  }
}