import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { salesService } from "service/Sales";

export default function SalesController(app: FastifyInstance) {
  app.get("/sales", async (request, reply) => {
    try {
      const { page = 1, pageSize = 10 } = request.query as SalesQuery;
      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

      const data = await salesService.getPageSummary({
        page: pageNumber,
        pageSize: pageSizeNumber
      });

      return reply.code(200).send(data)
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.post("/sales", async (request: FastifyRequest, reply: FastifyReply) => {
    const saleData = request.body as CreateSaleDTO;

    try {
      const newSale = await salesService.createSale(saleData);
      return reply.status(201).send(newSale);
    } catch (error: any) {
      console.error(error.message);
      return reply.code(400).send({ error: error.message });
    }
  });
}
