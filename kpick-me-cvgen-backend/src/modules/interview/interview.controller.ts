import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import type { Request } from 'express';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.interviewService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    const interview = await this.interviewService.findOne(id, userId);
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }

  @Post('start')
  async startInterview(
    @Body('role') role: string,
    @Body('cvId') cvId: string,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    return this.interviewService.startInterview(role, cvId, userId);
  }

  @Post(':id/answer')
  async submitAnswer(
    @Param('id') interviewId: string,
    @Body('questionIndex') questionIndex: number,
    @Body('answer') answer: string,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    const updatedInterview = await this.interviewService.submitAnswer(
      interviewId,
      questionIndex,
      answer,
      userId,
    );

    if (!updatedInterview) throw new NotFoundException('Interview not found');
    return updatedInterview;
  }
}
