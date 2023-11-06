/*
  Warnings:

  - You are about to drop the column `halfDate` on the `requestleave` table. All the data in the column will be lost.
  - Added the required column `leaveType` to the `RequestLeave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requestleave` DROP COLUMN `halfDate`,
    ADD COLUMN `leaveType` ENUM('FULLDAY', 'FIRSTHALF', 'SECONDHALF') NOT NULL;
