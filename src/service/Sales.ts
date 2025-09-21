import { Sales } from "@prisma/client";
import { prisma } from "prisma/client";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
class SalesService {
  public async getAllSales(): Promise<Sales[]> {
    const sales: Sales[] = await prisma.sales.findMany();

    return sales.map((sale) => ({
      id: sale.id,
      date: sale.date,
      total: sale.total,
      is_fiado: sale.is_fiado,
      payment_method: sale.payment_method,
      client_id: sale.client_id,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    }));
  }

  public async getTodaySales(): Promise<number>{

    const timezone = "America/Sao_Paulo";
    
    const now = new Date();

    const start = toZonedTime(startOfDay(now), timezone);
    const end = toZonedTime(endOfDay(now), timezone);

    const todaySales = await prisma.sales.findMany({
      where: {
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    })

    const totalEarnedToday = todaySales.reduce((acc, sale) => acc + sale.total, 0);
    
    return totalEarnedToday
  }

  public async createSale({
    products,
    client_id,
    is_fiado,
    payment_method,
  }: CreateSaleDTO): Promise<void> {

    if (products.length === 0 || !client_id || !payment_method) {
      throw new Error("Os campos necessários não foram preenchidos");
    }

    for (const product of products) {
      if (product.quantity <= 0 || product.price <= 0) {
        throw new Error("Quantidade ou preço inválido para o produto");
      }
      const productExists = await prisma.products.findUnique({
        where: { id: product.product_id },
      });

      if (!productExists) {
        throw new Error(`Produto com ID ${product.product_id} não existe`);
      }

      if(!productExists.isActive){
        throw new Error(`Produto com ID ${product.product_id} está inativo`);
      }

      if(product.quantity > productExists.quantity){
        throw new Error(`Estoque insuficiente para o produto com ID ${product.product_id}`);
      }

      await prisma.products.update({
        where: { id: product.product_id },
        data: { quantity: productExists.quantity - product.quantity }
      })
    }

    const total = products.reduce(
      (acc, products) => acc + products.quantity * products.price,
      0
    );

    const newSale: Sales = {
      id: crypto.randomUUID(),
      date: new Date(),
      total,
      is_fiado,
      payment_method,
      client_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await prisma.sales.create({
      data: newSale,
    });

    await prisma.sale_Products.createMany({
      data: products.map((product) => ({
        id: crypto.randomUUID(), 
        sale_id: newSale.id,
        product_id: product.product_id,
        quantity: product.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    
    return console.log("Venda criada com sucesso, id: " + newSale.id);
  }
}

export const salesService = new SalesService();
