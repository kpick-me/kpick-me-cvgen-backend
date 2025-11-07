// Replaced TypeORM entity with Prisma-backed type alias.
// Export the Prisma User type for compatibility with existing imports.
import type { User as PrismaUser } from '@prisma/client';
export type User = PrismaUser;