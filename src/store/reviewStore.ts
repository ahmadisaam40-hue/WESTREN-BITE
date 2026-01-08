import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review, ItemRating } from '@/types/menu';

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getItemAverageRating: (itemId: string) => number;
  getItemOrderCount: (itemId: string) => number;
  getMostOrderedItemId: () => string | null;
  getHighRatedItemIds: (minRating?: number) => string[];
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (reviewData) => {
        const review: Review = {
          ...reviewData,
          id: `review-${Date.now()}`,
          createdAt: new Date(),
        };
        set((state) => ({
          reviews: [review, ...state.reviews],
        }));
      },
      
      getItemAverageRating: (itemId: string) => {
        const { reviews } = get();
        const ratings: number[] = [];
        
        reviews.forEach((review) => {
          review.itemRatings.forEach((ir) => {
            if (ir.itemId === itemId) {
              ratings.push(ir.rating);
            }
          });
        });
        
        if (ratings.length === 0) return 0;
        return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      },
      
      getItemOrderCount: (itemId: string) => {
        const { reviews } = get();
        let count = 0;
        
        reviews.forEach((review) => {
          review.itemRatings.forEach((ir) => {
            if (ir.itemId === itemId) {
              count++;
            }
          });
        });
        
        return count;
      },
      
      getMostOrderedItemId: () => {
        const { reviews } = get();
        const orderCounts: Record<string, number> = {};
        
        reviews.forEach((review) => {
          review.itemRatings.forEach((ir) => {
            orderCounts[ir.itemId] = (orderCounts[ir.itemId] || 0) + 1;
          });
        });
        
        let maxCount = 0;
        let mostOrderedId: string | null = null;
        
        Object.entries(orderCounts).forEach(([id, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostOrderedId = id;
          }
        });
        
        // Only return if it has at least 3 orders
        return maxCount >= 3 ? mostOrderedId : null;
      },
      
      getHighRatedItemIds: (minRating = 4.5) => {
        const { reviews } = get();
        const ratingData: Record<string, { total: number; count: number }> = {};
        
        reviews.forEach((review) => {
          review.itemRatings.forEach((ir) => {
            if (!ratingData[ir.itemId]) {
              ratingData[ir.itemId] = { total: 0, count: 0 };
            }
            ratingData[ir.itemId].total += ir.rating;
            ratingData[ir.itemId].count++;
          });
        });
        
        const highRatedIds: string[] = [];
        Object.entries(ratingData).forEach(([id, data]) => {
          // Need at least 3 ratings
          if (data.count >= 3) {
            const avg = data.total / data.count;
            if (avg >= minRating) {
              highRatedIds.push(id);
            }
          }
        });
        
        return highRatedIds;
      },
    }),
    {
      name: 'western-bite-reviews',
    }
  )
);
