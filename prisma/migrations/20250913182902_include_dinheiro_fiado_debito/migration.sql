/*
  Warnings:

  - The values [BOLETO] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentMethod_new" AS ENUM ('CARTAO_CREDITO', 'CARTA_DEBITO', 'DINHEIRO', 'FIADO', 'PIX');
ALTER TABLE "public"."sales" ALTER COLUMN "payment_method" TYPE "public"."PaymentMethod_new" USING ("payment_method"::text::"public"."PaymentMethod_new");
ALTER TYPE "public"."PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "public"."PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;
