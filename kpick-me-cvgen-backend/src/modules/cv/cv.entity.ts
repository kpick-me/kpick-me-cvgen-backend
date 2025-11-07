// Replaced TypeORM entity with Prisma-backed type alias.
// Export the Prisma CV type for compatibility with existing imports.
import type { CV as PrismaCV } from '@prisma/client';
export type Cv = PrismaCV;