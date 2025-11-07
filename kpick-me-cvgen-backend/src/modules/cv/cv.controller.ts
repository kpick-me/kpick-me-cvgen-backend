import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';

@Controller('cv')
@UseGuards(AuthGuard('jwt'))
export class CvController {
  constructor(private cvService: CvService) {}

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
}