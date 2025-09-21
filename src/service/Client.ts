import { prisma } from "prisma/client";
import { Clients } from "@prisma/client";

class ClientService {
  public async getAllClients(): Promise<Clients[]> {
    const clients = await prisma.clients.findMany({
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
    });

    return clients;
  }

  public async countClients(): Promise<number> {
    const total = await prisma.clients.count();
    return total;
  }

  public async createClient({
    name,
    phone,
    address,
  }: CreateClienteDTO): Promise<void> {
    const clientAlreadyExist = await prisma.clients.findUnique({
      where: { phone },
    });

    if (clientAlreadyExist) throw new Error("ERRO: Cliente já existe");

    const newClient = {
      id: crypto.randomUUID(),
      name,
      address,
      phone,
      sales: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await prisma.clients.create({
      data: newClient,
    });
  }

  public async getByFiado(is_fiado: boolean): Promise<any> {
    const count = await prisma.sales.count({
      where: { is_fiado },
    });

    return count
  }
}

export const clientService = new ClientService();
