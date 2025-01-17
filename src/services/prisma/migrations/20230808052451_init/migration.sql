-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `displayname` VARCHAR(191) NOT NULL DEFAULT '',
    `awatar` VARCHAR(191) NOT NULL DEFAULT '',
    `language` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `isLocked` BOOLEAN NOT NULL DEFAULT false,
    `loginFailedCount` INTEGER NOT NULL DEFAULT 0,
    `lockedTime` DATETIME(3) NULL,
    `extra` JSON NULL,
    `ctime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creatorID` INTEGER NOT NULL,
    `trialConfigID` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('EDITABLE', 'FREEZE') NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `extra` JSON NULL,
    `ctime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrialConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creatorID` INTEGER NOT NULL,
    `projectIDs` JSON NOT NULL,
    `content` JSON NOT NULL,
    `extra` JSON NULL,
    `ctime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_creatorID_fkey` FOREIGN KEY (`creatorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_trialConfigID_fkey` FOREIGN KEY (`trialConfigID`) REFERENCES `TrialConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrialConfig` ADD CONSTRAINT `TrialConfig_creatorID_fkey` FOREIGN KEY (`creatorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
