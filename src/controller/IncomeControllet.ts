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
    });

    app.get("/income/monthly_comparison", {preHandler: [app.authenticate]}, async(request: FastifyRequest, reply: FastifyReply) =>{
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        //formata, pois o getMonth recebe de 0 a 11;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        //mesma coisa, se for janeiro, chama pra dezembro;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        try {
            const currentTotal = await incomeServices.getMonthlyIndicator(currentYear, currentMonth);
            const previousTotal = await incomeServices.getMonthlyIndicator(previousYear, previousMonth);

            return reply.status(200).send({
                currentMonthTotal: currentTotal,
                previousMonthTotal: previousTotal
            });
        } catch (error) {
            return reply.status(404).send(error);
        }
    })
}