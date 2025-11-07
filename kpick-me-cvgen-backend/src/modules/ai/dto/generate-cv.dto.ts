import { IsString, IsObject, IsOptional, IsArray } from 'class-validator';

export class GenerateCvDto {
  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsArray()
  @IsOptional()
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;

  @IsArray()
  @IsOptional()
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
  }>;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;

  @IsArray()
  @IsOptional()
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;

  @IsArray()
  @IsOptional()
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;

  @IsString()
  @IsOptional()
  targetRole?: string;

  @IsString()
  @IsOptional()
  targetIndustry?: string;
}

export class EnhanceCvDto {
  @IsObject()
  cvData: any;

  @IsString()
  @IsOptional()
  targetRole?: string;

  @IsString()
  @IsOptional()
  targetIndustry?: string;

  @IsArray()
  @IsOptional()
  focusAreas?: string[];
}

export class OptimizeCvDto {
  @IsObject()
  cvData: any;

  @IsString()
  jobDescription: string;
}

