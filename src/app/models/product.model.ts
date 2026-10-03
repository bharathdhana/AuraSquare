export interface Product {
  id: number;
  title: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  sellerId?: number;
  sellerName?: string;
}

export interface ToastNotification {
  id: number;
  type: 'success' | 'error';
  title: string;
  message: string;
}
