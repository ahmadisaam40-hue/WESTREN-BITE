import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, MenuCategory } from '@/types/menu';

interface MenuStore {
  items: MenuItem[];
  categories: MenuCategory[];
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  addCategory: (category: Omit<MenuCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

const defaultCategories: MenuCategory[] = [
  { id: 'burgers', name: 'Burgers', nameAr: 'برجر' },
  { id: 'steaks', name: 'Steaks', nameAr: 'ستيك' },
  { id: 'grills', name: 'Grills', nameAr: 'مشاوي' },
  { id: 'sides', name: 'Sides', nameAr: 'اطباق جانبية' },
  { id: 'drinks', name: 'Drinks', nameAr: 'مشروبات' },
  { id: 'desserts', name: 'Desserts', nameAr: 'حلويات' },
];

const defaultItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Western Burger',
    nameAr: 'برجر ويسترن كلاسيك',
    description: 'Juicy beef patty with cheddar, bacon, and BBQ sauce',
    descriptionAr: 'لحم بقري مع جبن شيدر، بيكون وصوص باربكيو',
    price: 12000,
    image: '',
    category: 'burgers',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Cowboy Ribeye Steak',
    nameAr: 'ستيك ريب آي كاوبوي',
    description: 'Premium ribeye steak grilled to perfection',
    descriptionAr: 'ستيك ريب آي مشوي على الفحم',
    price: 35000,
    image: '',
    category: 'steaks',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'BBQ Chicken Wings',
    nameAr: 'اجنحة دجاج باربكيو',
    description: 'Crispy wings glazed with smoky BBQ sauce',
    descriptionAr: 'اجنحة دجاج مقرمشة مع صوص باربكيو',
    price: 8000,
    image: '',
    category: 'grills',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Loaded Fries',
    nameAr: 'بطاطس محملة',
    description: 'Crispy fries with cheese, bacon bits and ranch',
    descriptionAr: 'بطاطس مقرمشة مع جبن وبيكون ورانش',
    price: 6000,
    image: '',
    category: 'sides',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Ice Cold Cola',
    nameAr: 'كولا مثلجة',
    description: 'Refreshing cola served ice cold',
    descriptionAr: 'كولا منعشة مثلجة',
    price: 2000,
    image: '',
    category: 'drinks',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Chocolate Brownie',
    nameAr: 'براوني شوكولاتة',
    description: 'Warm chocolate brownie with vanilla ice cream',
    descriptionAr: 'براوني شوكولاتة دافئ مع ايس كريم فانيلا',
    price: 7000,
    image: '',
    category: 'desserts',
    isAvailable: true,
  },
];

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      items: defaultItems,
      categories: defaultCategories,
      
      addItem: (itemData) => {
        const item: MenuItem = {
          ...itemData,
          id: `item-${Date.now()}`,
        };
        set((state) => ({
          items: [...state.items, item],
        }));
      },
      
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        }));
      },
      
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      
      addCategory: (categoryData) => {
        const category: MenuCategory = {
          ...categoryData,
          id: `cat-${Date.now()}`,
        };
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: 'western-bite-menu',
    }
  )
);
