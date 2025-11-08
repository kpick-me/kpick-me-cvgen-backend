import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CV, Prisma } from '@prisma/client';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string): Promise<CV[]> {
    return this.prisma.cV.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string): Promise<CV> {
    const cv = await this.prisma.cV.findFirst({
      where: { id, userId },
    });
    if (!cv) throw new NotFoundException('CV not found');
    return cv;
  }

  async create(createCvDto: CreateCvDto, userId: string): Promise<CV> {
    const { title, data, templateId } = createCvDto;

    return this.prisma.cV.create({
      data: {
        userId,
        template: templateId ?? 'default', 
        content: {
          title: title,
          body: data,
        },
      },
    });
  }

  async update(id: string, updateCvDto: UpdateCvDto, userId: string): Promise<CV> {
    const cv = await this.findOne(id, userId);

    const updateData: Prisma.CVUpdateInput = {};

    if (updateCvDto.templateId) {
      updateData.template = updateCvDto.templateId;
    }

    const currentContent = (cv.content as any) || {};
    let contentHasChanged = false;

    if (updateCvDto.title) {
      currentContent.title = updateCvDto.title;
      contentHasChanged = true;
    }
    if (updateCvDto.data) {
      currentContent.body = updateCvDto.data; 
    }

    if (contentHasChanged) {
      updateData.content = currentContent;
    }

    return this.prisma.cV.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); 
    await this.prisma.cV.delete({ where: { id } });
  }
  
  
  async generateShareLink(id: string, userId: string): Promise<{ link: string }> {
    const cv = await this.findOne(id, userId);
    const shareToken = Buffer.from(`${cv.id}:${Date.now()}`).toString('base64');
    return { link: `${process.env.FRONTEND_URL}/cv/share/${shareToken}` };
  }
}