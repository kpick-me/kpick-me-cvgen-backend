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
}