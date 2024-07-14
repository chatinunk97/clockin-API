/*
  Warnings:

  - You are about to drop the column `paymentId` on the `companyprofile` table. All the data in the column will be lost.
  - Made the column `packageId` on table `payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_packageId_fkey`;

-- AlterTable
ALTER TABLE `companyprofile` DROP COLUMN `paymentId`;

-- AlterTable
ALTER TABLE `payment` MODIFY `packageId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
