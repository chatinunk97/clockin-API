/*
  Warnings:

  - You are about to drop the column `latitudeCompany` on the `companyprofile` table. All the data in the column will be lost.
  - You are about to drop the column `longitudeCompany` on the `companyprofile` table. All the data in the column will be lost.
  - You are about to drop the column `leaveProfileId` on the `userleave` table. All the data in the column will be lost.
  - Added the required column `leaveProfiieId` to the `UserLeave` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userleave` DROP FOREIGN KEY `UserLeave_leaveProfileId_fkey`;

-- AlterTable
ALTER TABLE `clock` MODIFY `latitudeClockOut` DOUBLE NULL,
    MODIFY `longitudeClockOut` DOUBLE NULL,
    MODIFY `reasonLate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `companyprofile` DROP COLUMN `latitudeCompany`,
    DROP COLUMN `longitudeCompany`;

-- AlterTable
ALTER TABLE `user` MODIFY `position` ENUM('SUPERADMIN', 'ADMIN', 'USER', 'HR', 'MANEGER') NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `userleave` DROP COLUMN `leaveProfileId`,
    ADD COLUMN `leaveProfiieId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `CompanyLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitudeCompany` DOUBLE NOT NULL,
    `longitudeCompany` DOUBLE NOT NULL,
    `companyProfileId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompanyLocation` ADD CONSTRAINT `CompanyLocation_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLeave` ADD CONSTRAINT `UserLeave_leaveProfiieId_fkey` FOREIGN KEY (`leaveProfiieId`) REFERENCES `LeaveProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
