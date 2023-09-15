/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "fileUrl",
ADD COLUMN     "extraDetails" JSONB;
