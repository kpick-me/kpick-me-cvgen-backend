import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateCvDto {
  @IsString()
  title: string;

  @IsObject()
  data: any;

  @IsOptional()
  @IsString()
  templateId?: string;
}

export class UpdateCvDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsString()
  templateId?: string;
}