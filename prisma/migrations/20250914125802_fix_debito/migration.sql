/*
  Warnings:

  - The values [CARTA_DEBITO] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `productId` on the `sale_products` table. All the data in the column will be lost.
  - You are about to drop the column `saleId` on the `sale_products` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `sale_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_id` to the `sale_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentMethod_new" AS ENUM ('CARTAO_CREDITO', 'CARTAO_DEBITO', 'DINHEIRO', 'FIADO', 'PIX');
ALTER TABLE "public"."sales" ALTER COLUMN "payment_method" TYPE "public"."PaymentMethod_new" USING ("payment_method"::text::"public"."PaymentMethod_new");
ALTER TYPE "public"."PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "public"."PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."sale_products" DROP CONSTRAINT "sale_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sale_products" DROP CONSTRAINT "sale_products_saleId_fkey";

-- AlterTable
ALTER TABLE "public"."sale_products" DROP COLUMN "productId",
DROP COLUMN "saleId",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "sale_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."sale_products" ADD CONSTRAINT "sale_products_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_products" ADD CONSTRAINT "sale_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
