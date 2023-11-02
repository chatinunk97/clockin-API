/*
  Warnings:

  - The values [SECONDHAFT] on the enum `TimeProfile_typeTime` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `flexiblatime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `flexiblatime` DROP FOREIGN KEY `FlexiblaTime_timeProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `flexiblatime` DROP FOREIGN KEY `FlexiblaTime_userId_fkey`;

-- AlterTable
ALTER TABLE `timeprofile` MODIFY `typeTime` ENUM('DEFAULT', 'FIRSTHALF', 'SECONDHALF', 'NOTSPECIFIED') NOT NULL;

-- DropTable
DROP TABLE `flexiblatime`;

-- CreateTable
CREATE TABLE `FlexibleTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `timeProfileId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FlexibleTime` ADD CONSTRAINT `FlexibleTime_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlexibleTime` ADD CONSTRAINT `FlexibleTime_timeProfileId_fkey` FOREIGN KEY (`timeProfileId`) REFERENCES `TimeProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
