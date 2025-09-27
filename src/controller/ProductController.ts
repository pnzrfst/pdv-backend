import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { productService } from "service/Product";
import { CreateProductDTO, ProductQuery, UpdateProductInput } from "types/Product";

export default function ProductController(app: FastifyInstance) {
  // app.addHook("onRequest", app.authenticate);

  app.get("/products", async (request, reply) => {
    try {
      const {page = 1, pageSize = 10} = request.query as ProductQuery;

      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

      const data = await productService.getPageSummary({
        page: pageNumber,
        pageSize: pageSizeNumber
      });
      
      return reply.status(200).send(data);
    } catch (error) {
      return reply
        .code(400)
        .send({ error: "Não foi possível listar os produtos." });
    }
  });

  app.get("/products/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const product = await productService.getProductById(id);
      return reply.status(200).send(product);
    } catch (error) {
      return reply
        .code(500)
        .send({ error: "Não foi possível listar os produtos." });
    }
  });

  app.post(
    "/products",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as CreateProductDTO;

      try {
        const product = await productService.createProduct(body);
        return reply.status(201).send(product);
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  app.patch<{ Params: { id: string }; Body: Omit<UpdateProductInput, "id"> }>(
    "/products/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as UpdateProductInput;

      try {
        const product = await productService.updateProduct({ id, ...body });
        return reply.status(201).send(product);
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  app.delete(
    "/products",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { id: string };

      try {
        const product = await productService.deleteProduct(body.id);
        return reply.status(201).send(product);
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  
}
