import { Products } from "@prisma/client";
import { prisma } from "prisma/client";


class ProductServices {
    public async getAllProducts() : Promise <Products[]> {
        const products: Products[] = await prisma.products.findMany({
            where: {isActive: true}
        })

        return products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            cost: product.cost,
            price: product.price,
            description: product.description,
            isActive: product.isActive,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }))
    }

    public async createProduct({name, quantity, cost, price, description, categoryId} : CreateProductDTO) : Promise <void> {
        const category = await prisma.category.findUnique({
            where: {id: categoryId}
        });

        if(!category){
            throw new Error("Categoria não encontrada.");
        }
    
        const newProduct : Products ={
            id: crypto.randomUUID(),
            name,
            quantity,
            cost,
            price,
            description: description || "",
            categoryId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await prisma.$transaction([prisma.products.create({ data: newProduct })]);
    }

    public async updateProduct({id, quantity, cost, price, description} : UpdateProductDTO) : Promise <void> {
        const product = await prisma.products.findUnique({
            where: {id: id}
        });

        if(!product){
            throw new Error("Produto não encontrado.");
        }
    
        await prisma.$transaction([
            prisma.products.update({
                where: {id: id},
                data: {
                    quantity,
                    cost,
                    price,
                    description,
                    updatedAt: new Date()
                }
            })
        ]);
    }


    public async deleteProduct(id : string) : Promise <void> {
        const product = await prisma.products.findUnique({
            where: {id: id}
        });

        if(!product){
            throw new Error("Produto não encontrado.");
        }
    
        await prisma.$transaction([
            prisma.products.update({
                where: {id: id},
                data: {
                    isActive: false,
                    updatedAt: new Date()
                }
            })
        ]);
    }

}

export const productService = new ProductServices(); 