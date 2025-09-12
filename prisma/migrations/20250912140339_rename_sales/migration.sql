/*
  Warnings:

  - You are about to drop the column `clientId` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `sales` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."sales" DROP CONSTRAINT "sales_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."sales" DROP COLUMN "clientId",
DROP COLUMN "paymentMethod",
ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "payment_method" "public"."PaymentMethod" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
