import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findFirst({ where: { googleId } });
  }

  async create(userData: Prisma.UserCreateInput) { 
    return this.prisma.user.create({ data: userData });
  }

  async deleteUserData(userId: string) {
    await this.prisma.$transaction([
      this.prisma.trainingProgress.deleteMany({ where: { userId } }),
      this.prisma.interview.deleteMany({ where: { userId } }),
      this.prisma.cV.deleteMany({ where: { userId } }),
      this.prisma.user.delete({ where: { id: userId } }),
    ]);
    return { message: 'User data deleted successfully' };
  }

  async exportUserData(userId: string) {
    const [user, cvs, interviews, progress] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.cV.findMany({ where: { userId } }),
      this.prisma.interview.findMany({ where: { userId } }),
      this.prisma.trainingProgress.findMany({ where: { userId } }),
    ]);

    return { user, cvs, interviews, trainingProgress: progress };
  }
}