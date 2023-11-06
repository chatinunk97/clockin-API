/*
  Warnings:

  - You are about to drop the column `leaveProfiieId` on the `userleave` table. All the data in the column will be lost.
  - Added the required column `leaveProfileId` to the `UserLeave` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userleave` DROP FOREIGN KEY `UserLeave_leaveProfiieId_fkey`;

-- AlterTable
ALTER TABLE `leaveprofile` ADD COLUMN `defaultDateAmount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `userleave` DROP COLUMN `leaveProfiieId`,
    ADD COLUMN `leaveProfileId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserLeave` ADD CONSTRAINT `UserLeave_leaveProfileId_fkey` FOREIGN KEY (`leaveProfileId`) REFERENCES `LeaveProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
