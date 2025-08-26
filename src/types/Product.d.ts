interface CreateProductDTO {
    name: string;
    quantity: number;
    cost: number;
    price: number;
    description?: string;
    category_id: string;
}

interface UpdateProductDTO {
    id: string;
    quantity?: number;
    cost?: number;
    price?: number;
    description?: string;
}