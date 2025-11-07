import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Interview, Prisma } from '@prisma/client';

@Injectable()
export class InterviewService {
  constructor(
    private prisma: PrismaService, 
  ) {}

  async findAllByUser(userId: string): Promise<Interview[]> {
    return this.prisma.interview.findMany({ 
      where: { userId },
    });
  }

  async findOne(id: string, userId: string): Promise<Interview | null> {
    return this.prisma.interview.findFirst({
      where: { id, userId },
    });
  }

  async startInterview(role: string, cvId: string, userId: string): Promise<Interview> {
    const questions = [
      { question: 'Tell me about yourself', answer: '', feedback: '', score: 0 },
      { question: 'Why do you want this role?', answer: '', feedback: '', score: 0 },
      { question: 'What are your strengths?', answer: '', feedback: '', score: 0 },
    ];

    return this.prisma.interview.create({
      data: {
        role,
        questions,
        overallScore: 0,
        summary: '',
        userId, 
      }
    });
  }

  async submitAnswer(interviewId: string, questionIndex: number, answer: string, userId: string) : Promise<Interview | null> {
    const interview = await this.findOne(interviewId, userId);
    
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    const questions = interview.questions as any[];

    if (!questions || questionIndex < 0 || questionIndex >= questions.length) {
      throw new NotFoundException('Invalid question index');
    }

    questions[questionIndex].answer = answer;
    questions[questionIndex].feedback = 'Good answer with room for improvement';
    questions[questionIndex].score = 7;

    return this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        questions: questions,
      },
    });
  }
}