import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { categoryService } from "service/Category";

export default function CategoryController(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);
  app.get(
    "/categories",
    {preHandler: [app.authenticate]},
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const list = await categoryService.countCategories();
        return reply.status(200).send({ total: list });
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  app.get(
    "/categories/all",
    {preHandler: [app.authenticate]},
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const categories = await categoryService.getAllCategories();
        return reply.status(200).send(categories);
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  app.post(
    "/categories",
    {preHandler: [app.authenticate]},
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name } = request.body as { name: string };

      try {
        await categoryService.createCategory(name);
        return reply.status(200).send();
      } catch (error: any) {
        return reply.code(400).send({ error: error.message });
      }
    }
  );
}
