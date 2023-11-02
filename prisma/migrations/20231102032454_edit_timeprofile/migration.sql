-- AlterTable
ALTER TABLE `clock` ALTER COLUMN `clockOutTime` DROP DEFAULT;

-- AlterTable
ALTER TABLE `timeprofile` MODIFY `start` TIME NOT NULL,
    MODIFY `end` TIME NOT NULL;
