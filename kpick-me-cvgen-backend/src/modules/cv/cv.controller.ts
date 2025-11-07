import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @Get(':id/share')
  generateShareLink(@Param('id') id: string, @Req() req) {
    return this.cvService.generateShareLink(id, req.user.id);
  }
}
