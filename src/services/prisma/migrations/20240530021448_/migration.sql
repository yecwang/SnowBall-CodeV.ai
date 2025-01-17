/*
  Warnings:

  - You are about to alter the column `status` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[versionID]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `versionID` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `isLocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `versionID` INTEGER NOT NULL,
    MODIFY `status` ENUM('CREATED', 'DESIGNING', 'RELEASED') NOT NULL DEFAULT 'CREATED';

-- CreateTable
CREATE TABLE `ProjectVersion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('RELEASED_PROD', 'RELEASED_TEST', 'UNPUBLISHED') NOT NULL DEFAULT 'UNPUBLISHED',
    `projectID` INTEGER NOT NULL,
    `ctime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Project_versionID_key` ON `Project`(`versionID`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_versionID_fkey` FOREIGN KEY (`versionID`) REFERENCES `ProjectVersion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectVersion` ADD CONSTRAINT `ProjectVersion_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
