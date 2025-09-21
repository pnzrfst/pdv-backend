/*
  Warnings:

  - You are about to drop the column `isFiado` on the `sales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."sales" DROP COLUMN "isFiado",
ADD COLUMN     "is_fiado" BOOLEAN NOT NULL DEFAULT false;
