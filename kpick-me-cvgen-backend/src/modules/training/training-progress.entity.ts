import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('training_progress')
export class TrainingProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  challengeId: string;

  @Column({ default: 'code' })
  challengeType: string; // наприклад: "code", "quiz", "project"

  @Column({ default: 'in_progress' })
  status: string; // "in_progress" | "completed" | "failed"

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @ManyToOne(() => User, (user) => user.trainingProgress, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
