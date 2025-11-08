import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';

@Module({
  imports: [],
  providers: [CvService],
  controllers: [CvController],
  exports: [CvService],
})
export class CvModule {}