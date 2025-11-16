import { prisma } from "prisma/client";

class IncomeService {
  public async getTotalPerDate(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const nextDay = new Date(end.setDate(end.getDate() + 1));

    const total = await prisma.sales.aggregate({
      _sum: { total: true },
      where: {
        createdAt: {
          gte: start,
          lte: nextDay,
        },
      },
    });

    return total._sum.total ?? 0;
  }

  public async getMonthlyIndicator(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const total = await prisma.sales.aggregate({
      _sum: { total: true },
      where: {
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });

    return total._sum.total ?? 0;
  }

  public async getBestDayInMonth(year: number, month: number) {
    //pega a data e hora do primeiro dia do mes e transforma num obj date
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    //chama o db, passando o filtro de data
    const sales = await prisma.sales.findMany({
        where: {
            createdAt: {
                gte: start,
                lt: end,
            },
        }
    })


    //cria um obj generico p armazenar cada dia do mes e o total das vendas daquele dia
    const salesByDay: { [key: string]: number} = {};

    //percorre todas as vendas q vieram do db, criando um obj p cada dia do mes e somando o total de vendas daquele dia
    sales.forEach((sale) => {
        const day = sale.createdAt.getDate();

        if(!salesByDay[day]){
            salesByDay[day] = 0;
        }

        salesByDay[day] += sale.total;
    })

    //cria duas variaveis p armazenar o melhor dia e o total daquele dia

    let bestDay = "";
    let bestDayTotal = 0;

    //percorre o obj generico criado antes, verificando qual dia teve o maior total de vendas
    for(const day in salesByDay){
        if(salesByDay[day] > bestDayTotal){
            bestDay = day;
            bestDayTotal = salesByDay[day];
        };
    };

    const dt = new Date(year, month -1, parseInt(bestDay));  

    const formattedDay = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
    }).format(dt);
    return {
        bestDay: formattedDay,
        bestDayTotal
    }
  }
}

export const incomeServices = new IncomeService();
