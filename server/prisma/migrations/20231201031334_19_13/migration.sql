/*
  Warnings:

  - You are about to drop the column `collectionId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_collectionId_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `collectionId`;
