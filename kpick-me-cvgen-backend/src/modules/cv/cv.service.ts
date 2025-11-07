import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './cv.entity';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';
import PDFDocument from 'pdfkit';
import * as htmlDocx from 'html-docx-js';
import { Buffer } from 'buffer';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}

  async findAllByUser(userId: string): Promise<Cv[]> {
    return this.cvRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: string, userId: string): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!cv) throw new NotFoundException('CV not found');
    return cv;
  }

  async create(createCvDto: CreateCvDto, userId: string): Promise<Cv> {
    const cv = this.cvRepository.create({
      ...createCvDto,
      user: { id: userId },
    });
    return this.cvRepository.save(cv);
  }

  async update(id: string, updateCvDto: UpdateCvDto, userId: string): Promise<Cv> {
    const cv = await this.findOne(id, userId);
    Object.assign(cv, updateCvDto);
    return this.cvRepository.save(cv);
  }

  async remove(id: string, userId: string): Promise<void> {
    const cv = await this.findOne(id, userId);
    await this.cvRepository.remove(cv);
  }

  async exportToPdf(id: string, userId: string): Promise<Buffer> {
    const cv = await this.findOne(id, userId);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text(cv.title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(JSON.stringify(cv.data, null, 2));

      doc.end();
    });
  }

  async exportToDocx(id: string, userId: string): Promise<Buffer> {
    const cv = await this.findOne(id, userId);

    const html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; }
            h1 { font-size: 24pt; font-weight: bold; }
            pre { background-color: #f7f7f7; padding: 10px; border-radius: 4px; }
            </style>
        </head>
        <body>
            <h1>${cv.title}</h1>
            <pre>${JSON.stringify(cv.data, null, 2)}</pre>
        </body>
        </html>
    `;

    const docxBuffer = htmlDocx.asBlob(html);

    const buffer = Buffer.from(await docxBuffer.arrayBuffer());

    return buffer;
    }

  async exportToJson(id: string, userId: string): Promise<string> {
    const cv = await this.findOne(id, userId);
    return JSON.stringify(cv.data, null, 2);
  }

  async generateShareLink(id: string, userId: string): Promise<{ link: string }> {
    const cv = await this.findOne(id, userId);
    const shareToken = Buffer.from(`${cv.id}:${Date.now()}`).toString('base64');
    return { link: `${process.env.FRONTEND_URL}/cv/share/${shareToken}` };
  }
}