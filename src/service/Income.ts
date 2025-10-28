import { prisma } from "prisma/client"

class IncomeService {
    public async getTotalPerDate(startDate: string, endDate: string){
        const total = await prisma.sales.aggregate({
            _sum: {total: true},
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        })

        return total._sum.total ?? 0;
    }
}

export const incomeServices = new IncomeService()