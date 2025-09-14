import { prisma } from "prisma/client";
import { Clients } from "@prisma/client";

class ClientService{
    public async getAllClients(): Promise<Clients[]>{
        const clients = await prisma.clients.findMany({
            orderBy: [
                { name: 'asc' },
                { createdAt: 'desc' }
            ]
        })

        return clients;
    }

    public async countClients(): Promise<number> {
        const total = await prisma.clients.count();
        return total;
    }

    public async getByFiado(isFiado: boolean): Promise<any> {
        const filteredByFiado = await prisma.sales.findMany({
            where: { isFiado },
            orderBy: { createdAt: 'desc' },
            include: { client: true },
        });

        return filteredByFiado;
    }
}

export const clientService = new ClientService();