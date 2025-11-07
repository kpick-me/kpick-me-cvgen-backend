// Replaced TypeORM entity with Prisma-backed type alias.
import type { Interview as PrismaInterview } from '@prisma/client';
export type Interview = PrismaInterview;