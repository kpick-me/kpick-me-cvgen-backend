import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto, UpdateCvDto, CvWizardDto } from './dto/cv.dto';

@Controller('cv')
@UseGuards(AuthGuard('jwt'))
export class CvController {
  constructor(private cvService: CvService) {}

  @Get('templates')
  getTemplates() {
    return this.cvService.getTemplates();
  }

  @Get()
  findAll(@Req() req) {
    return this.cvService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.cvService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req) {
    return this.cvService.create(createCvDto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @Req() req) {
    return this.cvService.update(id, updateCvDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.cvService.remove(id, req.user.id);
  }

  @Get(':id/export/pdf')
  async exportPdf(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const pdf = await this.cvService.exportToPdf(id, req.user.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.send(pdf);
  }

  @Get(':id/export/docx')
  async exportDocx(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const docx = await this.cvService.exportToDocx(id, req.user.id);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.docx');
    res.send(docx);
  }

  @Get(':id/export/json')
  async exportJson(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const json = await this.cvService.exportToJson(id, req.user.id);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.json');
    res.send(json);
  }

  @Get(':id/share')
  generateShareLink(@Param('id') id: string, @Req() req) {
    return this.cvService.generateShareLink(id, req.user.id);
  }

  @Post('generate-with-ai')
  generateWithAi(@Body() data: any, @Req() req) {
    return this.cvService.generateWithAi(data, req.user.id);
  }

  @Post(':id/enhance-with-ai')
  enhanceWithAi(@Param('id') id: string, @Body() options: any, @Req() req) {
    return this.cvService.enhanceWithAi(id, req.user.id, options);
  }

  @Post(':id/optimize-for-job')
  optimizeForJob(@Param('id') id: string, @Body() body: { jobDescription: string }, @Req() req) {
    return this.cvService.optimizeForJob(id, req.user.id, body.jobDescription);
  }

  @Post('wizard')
  createFromWizard(@Body() wizardData: CvWizardDto, @Req() req) {
    return this.cvService.createFromWizard(wizardData, req.user.id);
  }

  @Get(':id/preview')
  previewCv(@Param('id') id: string, @Query('template') template: string, @Req() req) {
    return this.cvService.previewCv(id, req.user.id, template);
  }
}