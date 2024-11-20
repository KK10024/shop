import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { ImageRepository } from './repository/image.repository';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async saveImages(
    files: Express.Multer.File[],
    type: 'PRODUCT' | 'USER' | 'CATEGORY',
    id: number
  ) {
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