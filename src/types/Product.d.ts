interface CreateProductDTO {
  name: string;
  quantity: number;
  category_id: string;
  cost: number;
  price: number;
  description?: string;
}

interface getProductById {
  quantity: number;
  category_id: string;
  cost: number;
  price: number;
  description?: string;
}

export interface UpdateProductInput {
  quantity?: number;
  cost?: number;
  price?: number;
  description?: string;
}

interface UpdateProductDTO extends UpdateProductInput {
  id: string;
}
