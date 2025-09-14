
import { Category } from "@prisma/client";
import { prisma } from "prisma/client";

class CategoryService {
    public async createCategory(name : string): Promise<void> {
        const normalizedName = name.trim().toLocaleLowerCase();
        
        const nameAlreadyExists = await prisma.category.findFirst({
            where: { name: normalizedName }
        });

        if(nameAlreadyExists){
            throw new Error("Categoria já existe.");
        };

        const newCategory : Category = {
            id: crypto.randomUUID(),
            name: normalizedName,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await prisma.category.create({
            data: newCategory
        });
    }
    
    
    public async countCategories(): Promise<number> {
        const total = await prisma.category.count();
        return total;
    }

    public async getAllCategories(): Promise<Category[]> {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc"
            }
        });
        return categories;
    }
}

export const categoryService = new CategoryService();
