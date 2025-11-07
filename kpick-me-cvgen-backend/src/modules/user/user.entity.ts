import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Cv } from '../cv/cv.entity';
import { Interview } from '../interview/interview.entity';
import { TrainingProgress } from '../training/training-progress.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  googleId: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Cv, cv => cv.user)
  cvs: Cv[];

  @OneToMany(() => Interview, interview => interview.user)
  interviews: Interview[];

  @OneToMany(() => TrainingProgress, progress => progress.user)
  trainingProgress: TrainingProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}