// Replaced TypeORM entity with Prisma-backed type alias.
// The application uses Prisma models. This file exports the Prisma TrainingProgress type
// so other modules that imported the old entity can continue to use a type reference.
import type { TrainingProgress as PrismaTrainingProgress } from '@prisma/client';
export type TrainingProgress = PrismaTrainingProgress;
