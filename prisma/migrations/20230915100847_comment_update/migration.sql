/*
  Warnings:

  - Made the column `extraDetails` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "extraDetails" SET NOT NULL,
ALTER COLUMN "extraDetails" SET DEFAULT '{}';
