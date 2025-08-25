interface CreateProductDTO {
    name: string;
    quantity: number;
    cost: number;
    price: number;
    description?: string;
    categoryId: string;
}

interface UpdateProductDTO {
    id: string;
    quantity?: number;
    cost?: number;
    price?: number;
    description?: string;
}