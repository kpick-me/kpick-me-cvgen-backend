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
      { 
        id: '1', 
        title: 'JavaScript Fundamentals Quiz', 
        difficulty: 'Easy', 
        type: 'quiz',
        questions: [
          { question: 'What does "let" keyword do?', options: ['Declares a variable', 'Declares a constant', 'Defines a function', 'Creates an object'], correct: 0 },
          { question: 'What is closure?', options: ['A loop', 'A function with access to outer scope', 'A data type', 'An operator'], correct: 1 },
          { question: 'What is Promise used for?', options: ['Styling', 'Async operations', 'DOM manipulation', 'Type checking'], correct: 1 },
        ]
      },
      { 
        id: '2', 
        title: 'TypeScript Basics', 
        difficulty: 'Medium', 
        type: 'quiz',
        questions: [
          { question: 'What is TypeScript?', options: ['Framework', 'Library', 'Superset of JavaScript', 'Database'], correct: 2 },
          { question: 'What is interface used for?', options: ['Styling', 'Type definition', 'API calls', 'Testing'], correct: 1 },
        ]
      },
      { 
        id: '3', 
        title: 'React Concepts', 
        difficulty: 'Medium', 
        type: 'quiz',
        questions: [
          { question: 'What is useState?', options: ['A hook for state', 'A component', 'A router', 'A library'], correct: 0 },
          { question: 'What is JSX?', options: ['CSS', 'Syntax extension', 'Framework', 'Database'], correct: 1 },
        ]
      },
    ];
  }

  async getUserProgress(userId: string): Promise<TrainingProgress[]> {
    return this.prisma.trainingProgress.findMany({ 
      where: { userId },
    });
  }

  async submitChallenge(challengeId: string, solution: any, userId: string): Promise<TrainingProgress> {
    const challenges = await this.getChallenges();
    const challenge = challenges.find(c => c.id === challengeId);
    
    let score = 0;
    let status = 'failed';

    if (challenge && challenge.type === 'quiz' && Array.isArray(solution)) {
      const correctAnswers = solution.filter((ans, idx) => 
        challenge.questions[idx] && challenge.questions[idx].correct === ans
      ).length;
      score = Math.round((correctAnswers / challenge.questions.length) * 100);
      status = score >= 70 ? 'completed' : 'failed';
    } else {
      score = Math.floor(Math.random() * 100);
      status = score >= 70 ? 'completed' : 'failed';
    }

    const existing = await this.prisma.trainingProgress.findFirst({
      where: { challengeId, userId }
    });

    if (existing) {
      return this.prisma.trainingProgress.update({
        where: { id: existing.id },
        data: {
          status,
          score: Math.max(existing.score, score),
          attempts: existing.attempts + 1,
        }
      });
    }

    return this.prisma.trainingProgress.create({
      data: {
        challengeId,
        challengeType: challenge?.type || 'quiz',
        status,
        score,
        attempts: 1,
        userId,
      }
    });
  }
}