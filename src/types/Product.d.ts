interface CreateProductDTO {
    name: string;
    quantity: number;
    category_id: string;
    cost: number;
    price: number;
    description?: string;
}

interface UpdateProductDTO {
    id: string;
    quantity?: number;
    cost?: number;
    price?: number;
    description?: string;
}