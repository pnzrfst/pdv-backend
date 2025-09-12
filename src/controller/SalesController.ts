import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { salesService } from "service/Sales";


export default function SalesController(app: FastifyInstance){
   app.get("/sales", async(request, reply) => {
     try {
        const sales = await salesService.getAllSales();
        const countSales = sales.length;
        const averageTicket = sales.reduce((acc, sale) => acc + sale.total, 0);
        return reply.status(200).send({sales, countSales, averageTicket: averageTicket / countSales}); 
     } catch (error: any) {
        return reply.code(400).send({error: error.message});
     }
   });
}