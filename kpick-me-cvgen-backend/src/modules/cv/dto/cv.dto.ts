import { IsString, IsObject, IsOptional, IsEmail, IsArray } from 'class-validator';

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

export class CvWizardDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  experience?: any[];

  @IsOptional()
  @IsArray()
  education?: any[];

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  projects?: any[];

  @IsOptional()
  @IsString()
  template?: string;
}