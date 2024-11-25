import { Controller, Post, Delete, Param, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CustomLoggerService } from 'src/common/custom-logger/logger.service';

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService, 
    private readonly logger: CustomLoggerService
  ) {}

  // 여러 이미지 업로드
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('files', {  // 'files'는 formData의 필드명
      storage: diskStorage({
        destination: './uploads/image', // 파일이 저장될 경로
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // 파일 확장자
          const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, fileName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 최대 파일 크기 5MB
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[], // 업로드된 파일들
    @Body('type') type: 'PRODUCT' | 'USER' | 'CATEGORY',
    id: number  // 이미지 타입
  ) {
    try {
      this.logger.log("이미지 생성 컨트롤러 호출")
      const savedImages = await this.imageService.saveImages(files, type, id);
      return { message: 'Files uploaded successfully', data: savedImages };
    } catch (error) {
      return { message: 'Failed to upload files', error: error.message };
    }
  }

  // 이미지 삭제
  @Delete(':id')
  async deleteImage(@Param('id') id: number) {
    try {
      this.logger.log("이미지 삭제 컨트롤러 호출")
      await this.imageService.deleteImage(id);
      return { message: 'Image deleted successfully' };
    } catch (error) {
      return { message: 'Failed to delete image', error: error.message };
    }
  }
}