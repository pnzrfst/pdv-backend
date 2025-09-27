import { Sales } from "@prisma/client";
import { prisma } from "prisma/client";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface PaginationParams {
  page: number;
  pageSize: number;
}

enum PaymentMethod {
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  DINHEIRO = 'DINHEIRO',
  FIADO = 'FIADO',
  PIX = 'PIX'
}

class SalesService {
  public async getAllSales(params: PaginationParams): Promise<Sales[]> {
    const { page, pageSize } = params;

    const skipPage = (page - 1) * pageSize;

    const sales: Sales[] = await prisma.sales.findMany({
      skip: skipPage,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

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

  public async countTotalSales(): Promise<number> {
    return await prisma.sales.count();
  }

  public async getTodaySales(): Promise<number> {
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
    });

    const totalEarnedToday = todaySales.reduce(
      (acc, sale) => acc + sale.total,
      0
    );

    return totalEarnedToday;
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

      if (!productExists.isActive) {
        throw new Error(`Produto com ID ${product.product_id} está inativo`);
      }

      if (product.quantity > productExists.quantity) {
        throw new Error(
          `Estoque insuficiente para o produto com ID ${product.product_id}`
        );
      }

      await prisma.products.update({
        where: { id: product.product_id },
        data: { quantity: productExists.quantity - product.quantity },
      });
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

  public async getPageSummary({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) {
    const countTotalSales = await this.countTotalSales();

    const totalPages = Math.ceil(countTotalSales / pageSize);

    const sales = await this.getAllSales({
      page: page,
      pageSize: pageSize,
    });

    const averageTicket = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalEarnedToday = await this.getTodaySales();

    return {
      sales,
      countTotalSales,
      totalPages,
      averageTicket: averageTicket / countTotalSales,
      totalEarnedToday,
    };
  }

  public async getHomeSummary() {
    const allSales = await prisma.sales.findMany()

    const fiadoSales = allSales.reduce(
      (acc, sale) => (sale.is_fiado ? acc + 1 : acc),
      0
    );

    // pega o array de vendas, dá um reduce nele > cria um payment-method para cada vez q o acumulador for chamado, se ele
    // já existe, acrescenta 1 e retorna isso num tipo genérico.
    const mapMostUsedPaymentMethod = allSales.reduce((acc, paymentMethod) => {
      acc[paymentMethod.payment_method] =
        (acc[paymentMethod.payment_method] || 0) + 1;
      return acc;
    }, {} as Record<PaymentMethod, number>);

    // pega o obj gerado antes, transforma num array baseado em name, count
    const paymentMethodsArray = Object.entries(mapMostUsedPaymentMethod).map(
      ([name, acc]) => ({
        name,
        acc,
      })
    );

    //sort no array gerado antes, ordenando de forma decrescente.
    const sortedPaymentMethodsArray = paymentMethodsArray.sort(
      (a, b) => b.acc - a.acc
    );

    return {
      fiadoSales,
      mostUsedMethod: sortedPaymentMethodsArray[0],
    };
  }
}

export const salesService = new SalesService();
