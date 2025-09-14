interface CreateSaleDTO{ 
    products: { product_id: string; quantity: number; price: number}[];
    client_id: string;
    isFiado: boolean;
    payment_method: 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO' | 'FIADO' | 'PIX';
}