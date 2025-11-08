import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../../prisma/prisma.service';
import Anthropic from '@anthropic-ai/sdk';
import { GenerateCvDto, EnhanceCvDto, OptimizeCvDto } from './dto/generate-cv.dto';
import {
  CV_GENERATION_PROMPT,
  CV_ENHANCEMENT_PROMPT,
  CV_OPTIMIZATION_PROMPT,
} from './constants/prompts';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private anthropic: Anthropic;

  constructor(
    private cacheService: CacheService,
    private prismaService: PrismaService,
  ) {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  onModuleInit() {
    this.logger.log('AI Service initialized');
  }

  async generateCv(data: GenerateCvDto, userId: string): Promise<{ content: any; metadata: any }> {
    this.logger.log(`Generating CV for user: ${userId}`);

    const cachedResponse = await this.cacheService.getCachedResponse(data, userId);
    if (cachedResponse) {
      this.logger.log('Returning cached CV');
      return {
        content: cachedResponse.content,
        metadata: cachedResponse.metadata,
      };
    }

    try {
      const userContext = await this.buildUserContext(data);

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        system: CV_GENERATION_PROMPT,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Generate a professional resume based on the following information:

${userContext}

${data.targetRole ? `Target Role: ${data.targetRole}` : ''}
${data.targetIndustry ? `Target Industry: ${data.targetIndustry}` : ''}

Please create a compelling, ATS-optimized resume that highlights the candidate's strengths and aligns with their career goals. Return the result as a JSON object.`,
          },
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      let parsedContent;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawContent: content };
      } catch (parseError) {
        this.logger.warn('Failed to parse AI response as JSON, using raw content');
        parsedContent = { rawContent: content };
      }

      const result = {
        content: parsedContent,
        metadata: {
          model: 'claude-sonnet-4',
          generatedAt: new Date(),
          targetRole: data.targetRole,
          targetIndustry: data.targetIndustry,
        },
      };

      await this.cacheService.cacheResponse(data, userId, result);

      return result;
    } catch (error) {
      this.logger.error('Error generating CV:', error);
      throw new Error('Failed to generate CV with AI.');
    }
  }

  async enhanceCv(data: EnhanceCvDto, userId: string): Promise<{ content: any; metadata: any }> {
    this.logger.log(`Enhancing CV for user: ${userId}`);

    const cachedResponse = await this.cacheService.getCachedResponse(data, userId);
    if (cachedResponse) {
      this.logger.log('Returning cached enhanced CV');
      return {
        content: cachedResponse.content,
        metadata: cachedResponse.metadata,
      };
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        system: CV_ENHANCEMENT_PROMPT,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Enhance the following resume:

Current Resume:
${JSON.stringify(data.cvData, null, 2)}

${data.targetRole ? `Target Role: ${data.targetRole}` : ''}
${data.targetIndustry ? `Target Industry: ${data.targetIndustry}` : ''}
${data.focusAreas && data.focusAreas.length > 0 ? `Focus Areas: ${data.focusAreas.join(', ')}` : ''}

Please enhance this resume to make it more impactful and professional. Return the enhanced resume as a JSON object.`,
          },
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      let parsedContent;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawContent: content };
      } catch (parseError) {
        this.logger.warn('Failed to parse AI response as JSON, using raw content');
        parsedContent = { rawContent: content };
      }

      const result = {
        content: parsedContent,
        metadata: {
          model: 'claude-sonnet-4',
          enhancedAt: new Date(),
          targetRole: data.targetRole,
          targetIndustry: data.targetIndustry,
          focusAreas: data.focusAreas,
        },
      };

      await this.cacheService.cacheResponse(data, userId, result);

      return result;
    } catch (error) {
      this.logger.error('Error enhancing CV:', error);
      throw new Error('Failed to enhance CV with AI.');
    }
  }

  async optimizeCv(data: OptimizeCvDto, userId: string): Promise<{ content: any; metadata: any }> {
    this.logger.log(`Optimizing CV for job description for user: ${userId}`);

    const cachedResponse = await this.cacheService.getCachedResponse(data, userId);
    if (cachedResponse) {
      this.logger.log('Returning cached optimized CV');
      return {
        content: cachedResponse.content,
        metadata: cachedResponse.metadata,
      };
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        system: CV_OPTIMIZATION_PROMPT,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Optimize the following resume for this job description:

Job Description:
${data.jobDescription}

Current Resume:
${JSON.stringify(data.cvData, null, 2)}

Please tailor this resume to match the job description, highlighting relevant skills and experience. Return the optimized resume as a JSON object.`,
          },
        ],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      let parsedContent;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawContent: content };
      } catch (parseError) {
        this.logger.warn('Failed to parse AI response as JSON, using raw content');
        parsedContent = { rawContent: content };
      }

      const result = {
        content: parsedContent,
        metadata: {
          model: 'claude-sonnet-4',
          optimizedAt: new Date(),
          jobDescriptionLength: data.jobDescription.length,
        },
      };

      await this.cacheService.cacheResponse(data, userId, result);

      return result;
    } catch (error) {
      this.logger.error('Error optimizing CV:', error);
      throw new Error('Failed to optimize CV with AI.');
    }
  }

  private buildUserContext(data: GenerateCvDto): string {
    let context = `Personal Information:
Name: ${data.fullName}
${data.email ? `Email: ${data.email}` : ''}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.location ? `Location: ${data.location}` : ''}
${data.summary ? `Professional Summary: ${data.summary}` : ''}

`;

    if (data.experience && data.experience.length > 0) {
      context += `Work Experience:\n`;
      data.experience.forEach((exp, idx) => {
        context += `${idx + 1}. ${exp.position} at ${exp.company}
   Period: ${exp.startDate} - ${exp.endDate}
   Description: ${exp.description}
   ${exp.achievements && exp.achievements.length > 0 ? `Achievements:\n   - ${exp.achievements.join('\n   - ')}` : ''}
`;
      });
      context += '\n';
    }

    if (data.education && data.education.length > 0) {
      context += `Education:\n`;
      data.education.forEach((edu, idx) => {
        context += `${idx + 1}. ${edu.degree} in ${edu.field}
   Institution: ${edu.institution}
   Period: ${edu.startDate} - ${edu.endDate}
   ${edu.description ? `Description: ${edu.description}` : ''}
`;
      });
      context += '\n';
    }

    if (data.skills && data.skills.length > 0) {
      context += `Skills:\n${data.skills.join(', ')}\n\n`;
    }

    if (data.projects && data.projects.length > 0) {
      context += `Projects:\n`;
      data.projects.forEach((proj, idx) => {
        context += `${idx + 1}. ${proj.name}
   Description: ${proj.description}
   Technologies: ${proj.technologies.join(', ')}
   ${proj.link ? `Link: ${proj.link}` : ''}
`;
      });
      context += '\n';
    }

    if (data.certifications && data.certifications.length > 0) {
      context += `Certifications:\n`;
      data.certifications.forEach((cert, idx) => {
        context += `${idx + 1}. ${cert.name} - ${cert.issuer} (${cert.date})\n`;
      });
      context += '\n';
    }

    if (data.languages && data.languages.length > 0) {
      context += `Languages:\n`;
      data.languages.forEach((lang, idx) => {
        context += `${idx + 1}. ${lang.name} - ${lang.proficiency}\n`;
      });
      context += '\n';
    }

    return context;
  }

  async getStatus(): Promise<{ status: string; message: string }> {
    try {
      const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;

      if (!hasAnthropicKey) {
        return {
          status: 'misconfigured',
          message: 'AI service requires ANTHROPIC_API_KEY',
        };
      }

      return {
        status: 'operational',
        message: 'AI service is ready (Claude Sonnet 4)',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

