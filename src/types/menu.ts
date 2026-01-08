export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number; // in Iraqi Dinars
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameAr?: string;
  icon?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  pickupTime?: string;
  notes?: string;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  canModify?: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'purchase' | 'expense' | 'debt';
  isPaid: boolean;
  createdAt: Date;
  paidAt?: Date;
}

export interface AccountingStats {
  totalRevenue: number;
  totalExpenses: number;
  totalPurchases: number;
  totalDebts: number;
  unpaidDebts: number;
  netProfit: number;
}

// Rating and Review types
export interface ItemRating {
  itemId: string;
  rating: number; // 1-5
  createdAt: Date;
  orderId: string;
}

export interface Review {
  id: string;
  orderId: string;
  customerName: string;
  itemRatings: { itemId: string; itemName: string; rating: number }[];
  restaurantRating: number; // 1-5
  feedback: string;
  createdAt: Date;
}

// Receipt template
export interface ReceiptTemplate {
  showLogo: boolean;
  restaurantName: string;
  restaurantNameAr: string;
  address: string;
  addressAr: string;
  phone: string;
  showFooterMessage: boolean;
  footerMessage: string;
  footerMessageAr: string;
}
