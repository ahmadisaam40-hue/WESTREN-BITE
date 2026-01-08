import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReceiptTemplate } from '@/types/menu';

interface ReceiptStore {
  template: ReceiptTemplate;
  updateTemplate: (updates: Partial<ReceiptTemplate>) => void;
}

const defaultTemplate: ReceiptTemplate = {
  showLogo: true,
  restaurantName: 'Western Bite',
  restaurantNameAr: 'ويسترن بايت',
  address: 'Baghdad, Iraq',
  addressAr: 'بغداد، العراق',
  phone: '+964 XXX XXX XXXX',
  showFooterMessage: true,
  footerMessage: 'Thank you for your order!',
  footerMessageAr: 'شكراً لطلبكم!',
};

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set) => ({
      template: defaultTemplate,
      
      updateTemplate: (updates) => {
        set((state) => ({
          template: { ...state.template, ...updates },
        }));
      },
    }),
    {
      name: 'western-bite-receipt',
    }
  )
);
