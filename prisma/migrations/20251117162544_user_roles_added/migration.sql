-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'user';
