/*
  Warnings:

  - You are about to drop the column `latitudeCompany` on the `companyprofile` table. All the data in the column will be lost.
  - You are about to drop the column `longitudeCompany` on the `companyprofile` table. All the data in the column will be lost.
  - You are about to drop the column `halfDate` on the `requestleave` table. All the data in the column will be lost.
  - The values [SECONDHAFT] on the enum `TimeProfile_typeTime` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANEGER] on the enum `User_position` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `dateAmount` on the `userleave` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `flexiblatime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentId` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveType` to the `RequestLeave` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `flexiblatime` DROP FOREIGN KEY `FlexiblaTime_timeProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `flexiblatime` DROP FOREIGN KEY `FlexiblaTime_userId_fkey`;

-- AlterTable
ALTER TABLE `clock` MODIFY `clockInTime` VARCHAR(191) NOT NULL,
    MODIFY `clockOutTime` VARCHAR(191) NULL,
    MODIFY `latitudeClockOut` DOUBLE NULL,
    MODIFY `longitudeClockOut` DOUBLE NULL,
    MODIFY `statusClockIn` ENUM('ONTIME', 'LATE') NOT NULL DEFAULT 'ONTIME',
    MODIFY `reasonLate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `companyprofile` DROP COLUMN `latitudeCompany`,
    DROP COLUMN `longitudeCompany`,
    ADD COLUMN `paymentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `leaveprofile` ADD COLUMN `defaultDateAmount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `packageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `requestleave` DROP COLUMN `halfDate`,
    ADD COLUMN `leaveType` ENUM('FULLDAY', 'FIRSTHALF', 'SECONDHALF') NOT NULL,
    MODIFY `startDate` VARCHAR(191) NOT NULL,
    MODIFY `endDate` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `requestot` MODIFY `startTime` VARCHAR(191) NOT NULL,
    MODIFY `endTime` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `timeprofile` MODIFY `start` VARCHAR(191) NOT NULL,
    MODIFY `end` VARCHAR(191) NOT NULL,
    MODIFY `typeTime` ENUM('DEFAULT', 'FIRSTHALF', 'SECONDHALF', 'NOTSPECIFIED') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `position` ENUM('SUPERADMIN', 'ADMIN', 'USER', 'HR', 'MANAGER') NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `userleave` MODIFY `dateAmount` DOUBLE NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE `flexiblatime`;

-- CreateTable
CREATE TABLE `CompanyLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitudeCompany` DOUBLE NOT NULL,
    `longitudeCompany` DOUBLE NOT NULL,
    `companyProfileId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlexibleTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `timeProfileId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompanyLocation` ADD CONSTRAINT `CompanyLocation_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlexibleTime` ADD CONSTRAINT `FlexibleTime_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlexibleTime` ADD CONSTRAINT `FlexibleTime_timeProfileId_fkey` FOREIGN KEY (`timeProfileId`) REFERENCES `TimeProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
