export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  productId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  productId?: number;
  productBrand: string;
  productModel: string;
  productPrice: number;
  productTitle: string;
  quantity: number;
  subTotal: number;
}

export interface CartProduct {
  id: number;
  items?: CartItem[] | null;
  totalAmount?: number;
}
