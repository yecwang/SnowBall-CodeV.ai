/*
  Warnings:

  - You are about to drop the column `creatorID` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `trialConfigID` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `TrialConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_creatorID_fkey`;

-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_trialConfigID_fkey`;

-- DropForeignKey
ALTER TABLE `TrialConfig` DROP FOREIGN KEY `TrialConfig_creatorID_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `creatorID`,
    DROP COLUMN `trialConfigID`;

-- DropTable
DROP TABLE `TrialConfig`;
