import { Product } from './product.model';

export interface WishlistItem {
  id: number;
  productId?: number;
  product?: Product;
  title?: string;
  brand?: string;
  model?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
}

export interface Wishlist {
  id?: number;
  wishlistItems?: WishlistItem[];
  items?: WishlistItem[];
}
