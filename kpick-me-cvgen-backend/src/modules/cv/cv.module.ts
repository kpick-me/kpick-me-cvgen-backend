import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './cv.entity';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cv])],
  providers: [CvService],
  controllers: [CvController],
})
export class CvModule {}