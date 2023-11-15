/*
  Warnings:

  - You are about to drop the `clock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companyprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leaveprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestleave` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timeprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userleave` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `companyprofile` DROP FOREIGN KEY `CompanyProfile_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_packageId_fkey`;

-- DropIndex
DROP INDEX `CompanyLocation_companyProfileId_fkey` ON `CompanyLocation`;

-- DropIndex
DROP INDEX `FlexibleTime_timeProfileId_fkey` ON `FlexibleTime`;

-- DropIndex
DROP INDEX `FlexibleTime_userId_fkey` ON `FlexibleTime`;

-- DropIndex
DROP INDEX `UserRelationship_userBossId_fkey` ON `UserRelationship`;

-- DropIndex
DROP INDEX `UserRelationship_userId_fkey` ON `UserRelationship`;

-- DropTable
DROP TABLE `clock`;

-- DropTable
DROP TABLE `companyprofile`;

-- DropTable
DROP TABLE `leaveprofile`;

-- DropTable
DROP TABLE `payment`;

-- DropTable
DROP TABLE `requestleave`;

-- DropTable
DROP TABLE `requestot`;

-- DropTable
DROP TABLE `timeprofile`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userleave`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileImage` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `position` ENUM('SUPERADMIN', 'ADMIN', 'USER', 'HR', 'MANAGER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userType` ENUM('FULLTIME', 'PARTTIME') NOT NULL DEFAULT 'FULLTIME',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `checkLocation` BOOLEAN NOT NULL DEFAULT true,
    `companyProfileId` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NOT NULL,
    `packageId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyProfileId` INTEGER NOT NULL,
    `packageId` INTEGER NOT NULL,
    `paySlip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statusPayment` ENUM('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyProfileId` INTEGER NOT NULL,
    `leaveName` VARCHAR(191) NOT NULL,
    `defaultDateAmount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestLeave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userLeaveId` INTEGER NOT NULL,
    `startDate` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NOT NULL,
    `leaveType` ENUM('FULLDAY', 'FIRSTHALF', 'SECONDHALF') NOT NULL,
    `statusRequest` ENUM('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING',
    `messageLeave` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLeave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `leaveProfileId` INTEGER NOT NULL,
    `dateAmount` DOUBLE NOT NULL DEFAULT 0.0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `clockInTime` VARCHAR(191) NOT NULL,
    `clockOutTime` VARCHAR(191) NULL,
    `latitudeClockIn` DOUBLE NOT NULL,
    `longitudeClockIn` DOUBLE NOT NULL,
    `latitudeClockOut` DOUBLE NULL,
    `longitudeClockOut` DOUBLE NULL,
    `statusClockIn` ENUM('ONTIME', 'LATE', 'NOLOCATION') NOT NULL DEFAULT 'ONTIME',
    `reasonLate` VARCHAR(191) NULL,
    `reasonLocation` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyProfileId` INTEGER NOT NULL,
    `start` VARCHAR(191) NOT NULL,
    `end` VARCHAR(191) NOT NULL,
    `typeTime` ENUM('DEFAULT', 'FIRSTHALF', 'SECONDHALF', 'NOTSPECIFIED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requestOT` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `clockId` INTEGER NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `statusOT` ENUM('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING',
    `messageOT` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRelationship` ADD CONSTRAINT `UserRelationship_userBossId_fkey` FOREIGN KEY (`userBossId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRelationship` ADD CONSTRAINT `UserRelationship_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyProfile` ADD CONSTRAINT `CompanyProfile_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyLocation` ADD CONSTRAINT `CompanyLocation_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveProfile` ADD CONSTRAINT `LeaveProfile_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestLeave` ADD CONSTRAINT `RequestLeave_userLeaveId_fkey` FOREIGN KEY (`userLeaveId`) REFERENCES `UserLeave`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLeave` ADD CONSTRAINT `UserLeave_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLeave` ADD CONSTRAINT `UserLeave_leaveProfileId_fkey` FOREIGN KEY (`leaveProfileId`) REFERENCES `LeaveProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clock` ADD CONSTRAINT `Clock_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlexibleTime` ADD CONSTRAINT `FlexibleTime_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlexibleTime` ADD CONSTRAINT `FlexibleTime_timeProfileId_fkey` FOREIGN KEY (`timeProfileId`) REFERENCES `TimeProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeProfile` ADD CONSTRAINT `TimeProfile_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `CompanyProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requestOT` ADD CONSTRAINT `requestOT_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requestOT` ADD CONSTRAINT `requestOT_clockId_fkey` FOREIGN KEY (`clockId`) REFERENCES `Clock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
