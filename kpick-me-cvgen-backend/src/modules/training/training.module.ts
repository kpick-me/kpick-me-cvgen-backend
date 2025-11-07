import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingProgress } from './training-progress.entity'
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingProgress])],
  providers: [TrainingService],
  controllers: [TrainingController],
})
export class TrainingModule {}