import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { GenerateCvDto, EnhanceCvDto, OptimizeCvDto } from './dto/generate-cv.dto';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({ transform: true }))
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-cv')
  async generateCv(
    @Body() generateCvDto: GenerateCvDto,
    @Req() req,
  ): Promise<{ content: any; metadata: any }> {
    return this.aiService.generateCv(generateCvDto, req.user.id);
  }

  @Post('enhance-cv')
  async enhanceCv(
    @Body() enhanceCvDto: EnhanceCvDto,
    @Req() req,
  ): Promise<{ content: any; metadata: any }> {
    return this.aiService.enhanceCv(enhanceCvDto, req.user.id);
  }

  @Post('optimize-cv')
  async optimizeCv(
    @Body() optimizeCvDto: OptimizeCvDto,
    @Req() req,
  ): Promise<{ content: any; metadata: any }> {
    return this.aiService.optimizeCv(optimizeCvDto, req.user.id);
  }

  @Get('status')
  async getStatus(): Promise<{ status: string; message: string }> {
    return this.aiService.getStatus();
  }
}

