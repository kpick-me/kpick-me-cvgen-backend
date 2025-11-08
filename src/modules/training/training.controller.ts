import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TrainingService } from './training.service';

@Controller('training')
@UseGuards(AuthGuard('jwt'))
export class TrainingController {
  constructor(private trainingService: TrainingService) {}

  @Get('challenges')
  getChallenges() {
    return this.trainingService.getChallenges();
  }

  @Get('progress')
  getProgress(@Req() req) {
    return this.trainingService.getUserProgress(req.user.id);
  }

  @Post('submit')
  submitChallenge(@Body() body: { challengeId: string; solution: string }, @Req() req) {
    return this.trainingService.submitChallenge(body.challengeId, body.solution, req.user.id);
  }
}