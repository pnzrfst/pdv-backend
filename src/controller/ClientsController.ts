import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { clientService } from "service/Client";

export default function ClientsController(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);
  app.get(
    "/clients",
    { preHandler: [app.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const clients = await clientService.getAllClients();
        const countClients = await clientService.countClients();
        const filteredByFiado = await clientService.getByFiado(true);

        return reply.status(200).send({
          clients,
          countClients,
          filteredByFiado,
        });
      } catch (error) {
        console.error("Error fetching clients:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  app.post(
    "/clients",
    { preHandler: [app.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const newClient = request.body as CreateClienteDTO;

      try {
        await clientService.createClient(newClient);
        reply.status(201).send();
      } catch (error: any) {
        console.error(error.message);
        return reply.status(400).send({ error: "Mandou errado" });
      }
    }
  );
}
