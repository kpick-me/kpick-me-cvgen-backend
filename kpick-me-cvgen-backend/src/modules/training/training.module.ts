import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';

@Module({
  imports: [],
  providers: [TrainingService],
  controllers: [TrainingController],
})
export class TrainingModule {}