export type CategoryName =
  | 'Pakistani Suits'
  | 'Coord Sets'
  | 'Daily Wear'
  | 'Party Wear'
  | 'Bridal Wear';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export interface Product {
  id: string;
  name: string;
  category: CategoryName | string;
  price: number;
  salePrice?: number | null;
  description: string;
  images: string[];
  sizes: string[];
  color: string;
  available: boolean;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  fabric?: string;
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface StoreSettings {
  whatsappNumber: string;
  whatsappDisplay: string;
  storeName: string;
  addressLines: string[];
  googleMapsUrl: string;
  logoIconUrl: string;
  logoFullUrl: string;
  adminEmail: string;
  heroImageUrl?: string;
}
