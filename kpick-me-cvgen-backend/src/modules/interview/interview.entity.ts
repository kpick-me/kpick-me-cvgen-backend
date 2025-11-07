import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @Column('jsonb')
  questions: Array<{
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }>;

  @Column('int')
  overallScore: number;

  @Column('text')
  summary: string;

  @ManyToOne(() => User, user => user.interviews)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}