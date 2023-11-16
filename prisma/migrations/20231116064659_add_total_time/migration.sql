/*
  Warnings:

  - Added the required column `totalTime` to the `requestOT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requestot` ADD COLUMN `totalTime` INTEGER NOT NULL;
