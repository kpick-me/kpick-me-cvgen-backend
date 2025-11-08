-- Remove submittedAt column from training_progress
ALTER TABLE "training_progress" DROP COLUMN IF EXISTS "submittedAt";
