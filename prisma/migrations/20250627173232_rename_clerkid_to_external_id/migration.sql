/*
  Warnings:

  - You are about to drop the column `clerkid` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_clerkid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkid",
ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");
