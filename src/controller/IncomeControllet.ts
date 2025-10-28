import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { incomeServices } from "service/Income";

export default function IncomeController(app: FastifyInstance){
    app.addHook("onRequest", app.authenticate);
    
    app.get("/income/total_date", {preHandler: [app.authenticate]}, async(request: FastifyRequest, reply: FastifyReply) =>{
        const {startDate, endDate} = request.query as {startDate: string, endDate: string};

        try {
            const total = await incomeServices.getTotalPerDate(startDate, endDate);
            return reply.status(200).send({total});
        } catch (error) {
            return reply.status(404).send(error);
        }
    })
}