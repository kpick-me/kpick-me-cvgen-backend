import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { CacheModule } from '../cache/cache.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [CacheModule, PrismaModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}

