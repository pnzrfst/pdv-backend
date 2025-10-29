import { prisma } from "prisma/client"

class IncomeService {
    public async getTotalPerDate(startDate: string, endDate: string){
        const start = new Date(startDate);
        const end = new Date(endDate);

        const nextDay = new Date(end.setDate(end.getDate() + 1));



        const total = await prisma.sales.aggregate({
            _sum: {total: true},
            where: {
                createdAt: {
                    gte: start,
                    lte: nextDay
                }
            }
        })

        return total._sum.total ?? 0;
    }

    public async getMonthlyIndicator(year: number, month: number){
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const total = await prisma.sales.aggregate({
            _sum: {total: true},
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                }
            }
        })

        return total._sum.total ?? 0;
    }
}

export const incomeServices = new IncomeService()