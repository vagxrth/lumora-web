/*
  Warnings:

  - You are about to drop the column `summery` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "summery",
ADD COLUMN     "summary" TEXT;
