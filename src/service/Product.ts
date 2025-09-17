import { Products } from "@prisma/client";
import { prisma } from "prisma/client";
import { CreateProductDTO, UpdateProductDTO } from "types/Product";

class ProductServices {
  public async getAllProducts(): Promise<Products[]> {
    const products: Products[] = await prisma.products.findMany({
      where: { isActive: true },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      cost: product.cost,
      price: product.price,
      description: product.description,
      isActive: product.isActive,
      category_id: product.category_id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  public async getProductById(id: string) {
    const product = await prisma.products.findUnique({
      where: { id: id },
      select: {
        quantity: true,
        cost: true,
        price: true,
        description: true,
      },
    });

    console.log(product);

    if (!product) return null;

    return {
      quantity: product.quantity,
      cost: product.cost,
      price: product.price,
      description: product.description,
    };
  }

  public async createProduct({
    name,
    quantity,
    category_id,
    cost,
    price,
    description,
  }: CreateProductDTO): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id: category_id },
    });

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    const newProduct: Products = {
      id: crypto.randomUUID(),
      name,
      quantity,
      category_id,
      cost,
      price,
      description: description || "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await prisma.$transaction([prisma.products.create({ data: newProduct })]);
  }

  public async updateProduct({
    id,
    quantity,
    cost,
    price,
    description,
  }: UpdateProductDTO): Promise<void> {
    const product = await prisma.products.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    await prisma.$transaction([
      prisma.products.update({
        where: { id: id },
        data: {
          quantity,
          cost,
          price,
          description,
          updatedAt: new Date(),
        },
      }),
    ]);
  }

  public async deleteProduct(id: string): Promise<void> {
    const product = await prisma.products.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    await prisma.$transaction([
      prisma.products.update({
        where: { id: id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      }),
    ]);
  }

  public async getByParams(params: any): Promise<Products[]> {
    const whereClause: any = {
      isActive: true,
    };

    if (params.name) {
      whereClause.name = {
        contains: params.name,
        mode: "insensitive",
      };
    }

    if (params.category_id) {
      whereClause.category_id = params.category_id;
    }

    if (params.price) {
      whereClause.price = Number(params.price);
    }

    if (params.cost) {
      whereClause.cost = Number(params.cost);
    }

    const products: Products[] = await prisma.products.findMany({
      where: whereClause,
      orderBy:
        params.by && params.order
          ? { [params.by]: params.order }
          : { createdAt: "desc" },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      cost: product.cost,
      price: product.price,
      description: product.description,
      isActive: product.isActive,
      category_id: product.category_id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  public async countProducts(): Promise<number> {
    const total = await prisma.products.c({
      where: { isActive: true },
    });
    return total;
  }
}

export const productService = new ProductServices();
