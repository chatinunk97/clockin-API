/*
  Warnings:

  - The values [MANEGER] on the enum `User_position` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `position` ENUM('SUPERADMIN', 'ADMIN', 'USER', 'HR', 'MANAGER') NOT NULL DEFAULT 'USER';
