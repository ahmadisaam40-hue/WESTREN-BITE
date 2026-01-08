import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/store/languageStore';
import { useReviewStore } from '@/store/reviewStore';
import { Order } from '@/types/menu';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const RatingDialog = ({ open, onClose, order }: RatingDialogProps) => {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { addReview } = useReviewStore();
  
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleItemRating = (itemId: string, rating: number) => {
    setItemRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleSubmit = () => {
    // Validate at least restaurant rating
    if (restaurantRating === 0) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى تقييم المطعم' : 'Please rate the restaurant',
        variant: 'destructive',
      });
      return;
    }

    const itemRatingsArray = order.items.map(item => ({
      itemId: item.id,
      itemName: language === 'ar' && item.nameAr ? item.nameAr : item.name,
      rating: itemRatings[item.id] || 0,
    })).filter(ir => ir.rating > 0);

    addReview({
      orderId: order.id,
      customerName: order.customerName,
      itemRatings: itemRatingsArray,
      restaurantRating,
      feedback,
    });

    toast({
      title: language === 'ar' ? 'شكراً لتقييمك!' : 'Thank you for your feedback!',
      description: language === 'ar' ? 'نقدر رأيك' : 'We appreciate your review',
    });

    onClose();
  };

  const StarRating = ({ rating, onRate, size = 'md' }: { rating: number; onRate: (r: number) => void; size?: 'sm' | 'md' }) => {
    const starSize = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`${starSize} ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#252525] border-[#333] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display text-primary">
            {language === 'ar' ? 'قيم طلبك' : 'Rate Your Order'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Restaurant Rating */}
          <div className="text-center p-4 bg-[#1a1a1a] rounded-xl">
            <h3 className="font-display text-lg mb-3">
              {language === 'ar' ? 'قيم المطعم' : 'Rate the Restaurant'}
            </h3>
            <StarRating rating={restaurantRating} onRate={setRestaurantRating} />
          </div>

          {/* Item Ratings */}
          <div className="space-y-3">
            <h3 className="font-display text-lg">
              {language === 'ar' ? 'قيم الأصناف' : 'Rate Items'}
            </h3>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
              >
                <span className="text-sm">
                  {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                </span>
                <StarRating
                  rating={itemRatings[item.id] || 0}
                  onRate={(r) => handleItemRating(item.id, r)}
                  size="sm"
                />
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div>
            <h3 className="font-display text-lg mb-3">
              {language === 'ar' ? 'ملاحظاتك' : 'Your Feedback'}
            </h3>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={language === 'ar' ? 'أخبرنا عن تجربتك...' : 'Tell us about your experience...'}
              className="bg-[#1a1a1a] border-[#333] text-white min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#444] hover:bg-[#333]"
          >
            {language === 'ar' ? 'لاحقاً' : 'Later'}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
          >
            <Send className="w-4 h-4" />
            {language === 'ar' ? 'إرسال' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
