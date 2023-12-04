/*
  Warnings:

  - A unique constraint covering the columns `[userId,apiId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Collection` DROP FOREIGN KEY `Collection_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Movie` DROP FOREIGN KEY `Movie_collectionId_fkey`;

-- DropIndex
DROP INDEX `Movie_apiId_key` ON `Movie`;

-- AlterTable
ALTER TABLE `Movie` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Movie_userId_apiId_key` ON `Movie`(`userId`, `apiId`);
