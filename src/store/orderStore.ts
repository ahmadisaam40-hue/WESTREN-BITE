import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, Expense, AccountingStats, CartItem, OrderType } from '@/types/menu';

interface OrderStore {
  orders: Order[];
  expenses: Expense[];
  addOrder: (order: {
    items: CartItem[];
    customerName: string;
    customerPhone: string;
    orderType: OrderType;
    deliveryAddress?: string;
    deliveryLat?: number;
    deliveryLng?: number;
    pickupTime?: string;
    totalAmount: number;
    status: Order['status'];
    notes?: string;
  }) => string;
  updateOrder: (id: string, updates: Partial<Order>) => boolean;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;
  canModifyOrder: (id: string) => boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  markExpensePaid: (id: string) => void;
  deleteExpense: (id: string) => void;
  getAccountingStats: () => AccountingStats;
}

const MODIFICATION_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_STORED_ORDERS = 50; // Reduced limit to prevent localStorage quota issues

// Function to clear old orders from localStorage
const clearOldOrdersFromStorage = () => {
  try {
    const stored = localStorage.getItem('western-bite-orders');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state && parsed.state.orders) {
        // Keep only latest 20 orders
        parsed.state.orders = parsed.state.orders.slice(0, 20);
        localStorage.setItem('western-bite-orders', JSON.stringify(parsed));
      }
    }
  } catch (e) {
    // If all else fails, clear completely
    localStorage.removeItem('western-bite-orders');
  }
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      expenses: [],
      
      addOrder: (orderData) => {
        const orderId = `order-${Date.now()}`;
        const order: Order = {
          ...orderData,
          id: orderId,
          createdAt: new Date(),
        };
        
        // Try to clear old orders first if we have too many
        const currentOrders = get().orders;
        if (currentOrders.length > 30) {
          clearOldOrdersFromStorage();
        }
        
        set((state) => {
          // Keep only the latest orders to prevent quota exceeded
          const newOrders = [order, ...state.orders].slice(0, MAX_STORED_ORDERS);
          return { orders: newOrders };
        });
        return orderId;
      },
      
      updateOrder: (id: string, updates: Partial<Order>) => {
        const canModify = get().canModifyOrder(id);
        if (!canModify) return false;
        
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        }));
        return true;
      },
      
      updateOrderStatus: (id: string, status: Order['status']) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  completedAt: status === 'completed' ? new Date() : o.completedAt,
                }
              : o
          ),
        }));
      },
      
      getOrderById: (id: string) => {
        const orders = get().orders;
        // Try exact match first
        const exactMatch = orders.find((o) => o.id === id);
        if (exactMatch) return exactMatch;
        
        // Try matching by the last 6 characters (what the user sees)
        return orders.find((o) => o.id.slice(-6).toUpperCase() === id.toUpperCase());
      },
      
      canModifyOrder: (id: string) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return false;
        
        const createdAt = new Date(order.createdAt).getTime();
        const now = Date.now();
        const timePassed = now - createdAt;
        
        return timePassed < MODIFICATION_WINDOW_MS && order.status === 'pending';
      },
      
      addExpense: (expenseData) => {
        const expense: Expense = {
          ...expenseData,
          id: `expense-${Date.now()}`,
          createdAt: new Date(),
        };
        set((state) => ({
          expenses: [expense, ...state.expenses],
        }));
      },
      
      markExpensePaid: (id: string) => {
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, isPaid: true, paidAt: new Date() } : e
          ),
        }));
      },
      
      deleteExpense: (id: string) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },
      
      getAccountingStats: () => {
        const { orders, expenses } = get();
        
        // Include all non-cancelled orders in revenue (not just completed)
        const validOrders = orders.filter((o) => o.status !== 'cancelled');
        const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        const purchases = expenses.filter((e) => e.category === 'purchase');
        const generalExpenses = expenses.filter((e) => e.category === 'expense');
        const debts = expenses.filter((e) => e.category === 'debt');
        
        const totalPurchases = purchases.reduce((sum, e) => sum + e.amount, 0);
        const totalExpenses = generalExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalDebts = debts.reduce((sum, e) => sum + e.amount, 0);
        const unpaidDebts = debts.filter((e) => !e.isPaid).reduce((sum, e) => sum + e.amount, 0);
        
        const netProfit = totalRevenue - totalPurchases - totalExpenses;
        
        return {
          totalRevenue,
          totalExpenses,
          totalPurchases,
          totalDebts,
          unpaidDebts,
          netProfit,
        };
      },
    }),
    {
      name: 'western-bite-orders',
    }
  )
);