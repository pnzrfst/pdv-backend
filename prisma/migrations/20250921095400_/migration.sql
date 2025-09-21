/*
  Warnings:

  - You are about to drop the column `email` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."clients_email_key";

-- AlterTable
ALTER TABLE "public"."clients" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_key" ON "public"."clients"("phone");
