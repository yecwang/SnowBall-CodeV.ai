/*
  Warnings:

  - You are about to drop the column `versionID` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_versionID_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `versionID`;
