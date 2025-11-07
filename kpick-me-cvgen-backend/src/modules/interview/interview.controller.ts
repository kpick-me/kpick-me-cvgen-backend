import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
  ) {}

  async findAllByUser(userId: string): Promise<Interview[]> {
    return this.interviewRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: string, userId: string): Promise<Interview> {
    return this.interviewRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async startInterview(role: string, cvId: string, userId: string) {
    // Generate questions using AI (placeholder)
    const questions = [
      { question: 'Tell me about yourself', answer: '', feedback: '', score: 0 },
      { question: 'Why do you want this role?', answer: '', feedback: '', score: 0 },
      { question: 'What are your strengths?', answer: '', feedback: '', score: 0 },
    ];

    const interview = this.interviewRepository.create({
      role,
      questions,
      overallScore: 0,
      summary: '',
      user: { id: userId },
    });

    return this.interviewRepository.save(interview);
  }

  async submitAnswer(interviewId: string, questionIndex: number, answer: string, userId: string) {
    const interview = await this.findOne(interviewId, userId);
    
    // Generate feedback using AI (placeholder)
    interview.questions[questionIndex].answer = answer;
    interview.questions[questionIndex].feedback = 'Good answer with room for improvement';
    interview.questions[questionIndex].score = 7;

    return this.interviewRepository.save(interview);
  }
}