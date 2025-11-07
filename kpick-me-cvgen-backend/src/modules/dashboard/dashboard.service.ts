import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUserDashboard(userId: string) {
    const [user, cvCount, interviews, progress] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.cV.count({ where: { userId } }),
      this.prisma.interview.findMany({ 
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.trainingProgress.findMany({ 
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      user,
      stats: {
        cvCount,
        interviewCount: interviews.length,
        completedChallenges: progress.filter(p => p.status === 'completed').length,
        totalChallenges: progress.length,
      },
      recentInterviews: interviews,
      recentProgress: progress,
      quickActions: [
        { title: 'Create CV', url: '/cv/generate-with-ai', icon: 'document' },
        { title: 'Start Interview', url: '/interviews/start', icon: 'microphone' },
        { title: 'Practice Quiz', url: '/training/challenges', icon: 'academic-cap' },
      ],
    };
  }

  async getUserStats(userId: string) {
    const [cvs, interviews, progress] = await Promise.all([
      this.prisma.cV.findMany({ where: { userId } }),
      this.prisma.interview.findMany({ where: { userId } }),
      this.prisma.trainingProgress.findMany({ where: { userId } }),
    ]);

    return {
      totalCVs: cvs.length,
      totalInterviews: interviews.length,
      avgInterviewScore: interviews.length > 0
        ? Math.round(interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length)
        : 0,
      completedChallenges: progress.filter(p => p.status === 'completed').length,
      totalScore: progress.reduce((sum, p) => sum + p.score, 0),
    };
  }
}

