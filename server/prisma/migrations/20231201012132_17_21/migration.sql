/*
  Warnings:

  - You are about to drop the column `description` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `auth0Id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[collectionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_auth0Id_key` ON `User`;

-- AlterTable
ALTER TABLE `Movie` DROP COLUMN `description`,
    DROP COLUMN `releaseDate`,
    DROP COLUMN `title`,
    MODIFY `rating` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `auth0Id`,
    ADD COLUMN `picture` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_collectionId_key` ON `User`(`collectionId`);
