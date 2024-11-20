import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageRepository {
  private readonly repository: Repository<Image>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Image);
  }

  async createAndSaveImages(fileData: any[]) {
    // 예시: fileData에서 type 값이 포함된 이미지들을 저장하는 로직
    return await this.repository.save(fileData);
  }

  async findById(id: number): Promise<Image | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}