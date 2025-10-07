import { PaymentMethod } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { productService } from "service/Product";
import { salesService } from "service/Sales";

export default function SummaryController(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);
  app.get(
    "/product-summary",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      try {
        const data = await productService.getHomeSummary();

        return reply.status(200).send({
          lowStockProducts: data.lowStockProducts.length,
          biggerStock: data.biggerStock,
          lowerStock: data.lowerStock,
        });
      } catch (error) {
        return reply
          .code(400)
          .send({ error: "Não foi possível listar os produtos." });
      }
    }
  );

  app.get(
    "/sales-summary",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      try {
        const data = await salesService.getHomeSummary();
        return reply.status(200).send(data);
      } catch (error) {
        return reply
          .code(400)
          .send({ error: "Não foi possível listar as vendas." });
      }
    }
  );
}
