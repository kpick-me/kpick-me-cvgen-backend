import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingProgress } from './training-progress.entity';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(TrainingProgress)
    private progressRepository: Repository<TrainingProgress>,
  ) {}

  async getChallenges() {
    return [
      { id: '1', title: 'FizzBuzz', difficulty: 'Easy', type: 'code' },
      { id: '2', title: 'Two Sum', difficulty: 'Medium', type: 'code' },
      { id: '3', title: 'JavaScript Basics', difficulty: 'Easy', type: 'quiz' },
    ];
  }

  async getUserProgress(userId: string) {
    return this.progressRepository.find({ where: { user: { id: userId } } });
  }

  async submitChallenge(challengeId: string, solution: string, userId: string) {
    // Validate solution (placeholder)
    const score = Math.floor(Math.random() * 100);
    const status = score >= 70 ? 'completed' : 'failed';

    const progress = this.progressRepository.create({
      challengeId,
      challengeType: 'code',
      status,
      score,
      attempts: 1,
      user: { id: userId },
    });

    return this.progressRepository.save(progress);
  }
}