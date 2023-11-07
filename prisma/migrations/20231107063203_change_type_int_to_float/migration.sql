/*
  Warnings:

  - You are about to alter the column `dateAmount` on the `userleave` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `userleave` MODIFY `dateAmount` DOUBLE NOT NULL DEFAULT 0.0;
