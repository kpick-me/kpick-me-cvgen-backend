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
      { question: 'Tell me about yourself and your background', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'Why do you want this role?', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'What are your main strengths?', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'Describe a challenging project you worked on', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'How do you handle tight deadlines?', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'Where do you see yourself in 3 years?', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'What technical skills are you most proficient in?', answer: '', feedback: '', score: 0, timeSpent: 0 },
      { question: 'Do you have any questions for us?', answer: '', feedback: '', score: 0, timeSpent: 0 },
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

  async submitAnswer(interviewId: string, questionIndex: number, answer: string, userId: string, timeSpent?: number) : Promise<Interview | null> {
    const interview = await this.findOne(interviewId, userId);
    
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    const questions = interview.questions as any[];

    if (!questions || questionIndex < 0 || questionIndex >= questions.length) {
      throw new NotFoundException('Invalid question index');
    }

    questions[questionIndex].answer = answer;
    questions[questionIndex].timeSpent = timeSpent || 0;
    
    const score = Math.min(10, Math.max(5, 10 - Math.floor(answer.length / 100)));
    questions[questionIndex].score = score;
    
    const feedbacks = [
      'Strong answer demonstrating good understanding',
      'Good response with relevant details',
      'Clear answer, could provide more specific examples',
      'Adequate response, consider adding more depth',
    ];
    questions[questionIndex].feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

    const answeredCount = questions.filter(q => q.answer).length;
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
    const overallScore = answeredCount > 0 ? Math.round((totalScore / answeredCount) * 10) : 0;

    const summary = answeredCount === questions.length
      ? `Interview completed with ${overallScore}% overall score. ${overallScore >= 70 ? 'Strong performance!' : 'Consider practicing more.'}`
      : `${answeredCount}/${questions.length} questions answered`;

    return this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        questions,
        overallScore,
        summary,
      },
    });
  }
}