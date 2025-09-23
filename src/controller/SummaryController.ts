import { PaymentMethod } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { productService } from "service/Product";
import { salesService } from "service/Sales";

export default function SummaryController(app: FastifyInstance) {
  app.get("/product-summary", async (request, reply) => {
    try {
      const allProducts = await productService.getAllProducts();

      const lowStockProducts = allProducts.filter(
        (product) => product.quantity <= 20
      );

      const mapProductWithBiggerStock = [...allProducts].sort(
        (a, b) => b.quantity - a.quantity
      );

      const mapProductWithLowerStock = [...allProducts].sort(
        (a, b) => a.quantity - b.quantity
      );

      const biggerStock = {
        name: mapProductWithBiggerStock[0].name,
      };

      const lowerStock = {
        name: mapProductWithLowerStock[0].name,
      };

      return reply.status(200).send({
        lowStockProducts: lowStockProducts.length,
        biggerStock: biggerStock,
        lowerStock: lowerStock,
      });
    } catch (error) {
      return reply
        .code(400)
        .send({ error: "Não foi possível listar os produtos." });
    }
  });

  app.get("/sales-summary", async (request, reply) => {
    try {
      const allSales = await salesService.getAllSales();

      const fiadoSales = allSales.reduce(
        (acc, sale) => (sale.is_fiado ? acc + 1 : acc),
        0
      );

      const mostUsedPaymentMethod = allSales.reduce((acc, paymentMethod) => {
        acc[paymentMethod.payment_method] =
          (acc[paymentMethod.payment_method] || 0) + 1;
        return acc;
      }, {} as Record<PaymentMethod, number>);

      return reply.status(200).send({
        fiadoSales,
        mostUsedPaymentMethod
      });
    } catch (error) {
      return reply
        .code(400)
        .send({ error: "Não foi possível listar os produtos." });
    }
  });
}
