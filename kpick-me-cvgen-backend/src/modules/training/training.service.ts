import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrainingProgress } from '@prisma/client';

@Injectable()
export class TrainingService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getChallenges() {
    return [
      { id: '1', title: 'FizzBuzz', difficulty: 'Easy', type: 'code' },
      { id: '2', title: 'Two Sum', difficulty: 'Medium', type: 'code' },
      { id: '3', title: 'JavaScript Basics', difficulty: 'Easy', type: 'quiz' },
    ];
  }

  async getUserProgress(userId: string): Promise<TrainingProgress[]> {
    return this.prisma.trainingProgress.findMany({ 
      where: { userId },
    });
  }

  async submitChallenge(challengeId: string, solution: string, userId: string): Promise<TrainingProgress> {
    const score = Math.floor(Math.random() * 100);
    const status = score >= 70 ? 'completed' : 'failed';

    return this.prisma.trainingProgress.create({
      data: {
        challengeId,
        challengeType: 'code', 
        status,
        score,
        attempts: 1,
        userId,
      }
    });
  }
}