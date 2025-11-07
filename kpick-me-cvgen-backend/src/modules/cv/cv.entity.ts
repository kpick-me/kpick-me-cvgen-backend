import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('cvs')
export class Cv {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('jsonb')
  data: {
    personalInfo: any;
    experience: any[];
    education: any[];
    skills: any[];
    languages: any[];
  };

  @Column({ nullable: true })
  templateId: string;

  @ManyToOne(() => User, user => user.cvs)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}