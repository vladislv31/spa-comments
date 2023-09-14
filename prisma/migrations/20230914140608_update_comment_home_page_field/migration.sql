/*
  Warnings:

  - You are about to alter the column `homePage` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "homePage" DROP NOT NULL,
ALTER COLUMN "homePage" SET DATA TYPE VARCHAR(255);
