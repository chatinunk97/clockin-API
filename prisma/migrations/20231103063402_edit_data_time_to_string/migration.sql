/*
  Warnings:

  - Made the column `clockOutTime` on table `clock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `clock` MODIFY `clockInTime` VARCHAR(191) NOT NULL,
    MODIFY `clockOutTime` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `flexibletime` MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `requestot` MODIFY `startTime` VARCHAR(191) NOT NULL,
    MODIFY `endTime` VARCHAR(191) NOT NULL;
