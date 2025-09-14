import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { clientService } from "service/Client";


export default function ClientsController(app: FastifyInstance){
    app.get("/clients", async(request: FastifyRequest, reply: FastifyReply) =>{
        try {
            const clients = await clientService.getAllClients();
            const countClients = await clientService.countClients();
            const filteredByFiado = await clientService.getByFiado(true);

            return reply.status(200).send({
                clients,
                countClients,
                filteredByFiado
            });
        } catch (error) {
            console.error("Error fetching clients:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    })
}