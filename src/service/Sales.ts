import { Sales } from "@prisma/client";
import { prisma } from "prisma/client";

class SalesService {
    public async getAllSales(): Promise<Sales[]> {
        const sales: Sales[] = await prisma.sales.findMany();

        return sales.map((sale) => ({
            id: sale.id,
            date: sale.date,
            total: sale.total,
            payment_method: sale.payment_method,
            client_id: sale.client_id,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
        }));
    }
}

export const salesService = new SalesService();