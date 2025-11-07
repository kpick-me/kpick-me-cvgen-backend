import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CV, Prisma } from '@prisma/client';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';
import PDFDocument from 'pdfkit';
import * as htmlDocx from 'html-docx-js';
import { Buffer } from 'buffer';

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

  async exportToPdf(id: string, userId: string): Promise<Buffer> {
    const cv = await this.findOne(id, userId);
    
    const content = cv.content as any;
    const title = content?.title || 'Untitled CV';
    const body = content?.body || {};

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text(title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(JSON.stringify(body, null, 2)); 

      doc.end();
    });
  }

  async exportToDocx(id: string, userId: string): Promise<Buffer> {
    const cv = await this.findOne(id, userId);

    const content = cv.content as any;
    const title = content?.title || 'Untitled CV';
    const body = content?.body || {};

    const html = `
        <html>
        <head><meta charset="UTF-8"></head>
        <body>
            <h1>${title}</h1>
            <pre>${JSON.stringify(body, null, 2)}</pre>
        </body>
        </html>
    `;

    const docxBuffer = htmlDocx.asBlob(html);
    return Buffer.from(await docxBuffer.arrayBuffer());
  }

  async exportToJson(id: string, userId: string): Promise<string> {
    const cv = await this.findOne(id, userId);
    return JSON.stringify(cv.content, null, 2);
  }
  
  async generateShareLink(id: string, userId: string): Promise<{ link: string }> {
    const cv = await this.findOne(id, userId);
    const shareToken = Buffer.from(`${cv.id}:${Date.now()}`).toString('base64');
    return { link: `${process.env.FRONTEND_URL}/cv/share/${shareToken}` };
  }
}