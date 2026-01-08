import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Plus, Minus, ShoppingCart, Sparkles, Star, Flame } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from '@/store/languageStore';
import { useReviewStore } from '@/store/reviewStore';
import { useToast } from '@/hooks/use-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { addItem, items, updateQuantity } = useCartStore();
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { getItemAverageRating, getMostOrderedItemId, getHighRatedItemIds } = useReviewStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);
  
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;
  
  const avgRating = getItemAverageRating(item.id);
  const isHighRated = getHighRatedItemIds().includes(item.id);
  const isMostOrdered = getMostOrderedItemId() === item.id;

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        gsap.to(card, {
          rotateX: -rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      };
      
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(item);
    setIsAdded(true);
    toast({
      title: language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart',
      description: language === 'ar' 
        ? `تم إضافة ${item.nameAr || item.name} إلى سلة التسوق.`
        : `${item.name} has been added to your cart.`,
    });
    
    gsap.fromTo(
      '.cart-badge',
      { scale: 1.5 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );

    setTimeout(() => setIsAdded(false), 1500);
  };

  const displayName = language === 'ar' && item.nameAr ? item.nameAr : item.name;
  const displayDesc = language === 'ar' && item.descriptionAr ? item.descriptionAr : item.description;

  return (
    <div
      ref={cardRef}
      className="card-western group relative"
      style={{ transformStyle: 'preserve-3d' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500" />
      
      {/* Card Content */}
      <div className="relative bg-card rounded-xl overflow-hidden border border-border/50">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-secondary">
          {item.image ? (
            <img
              src={item.image}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-wood">
              <span className="font-display text-5xl text-primary/30">WB</span>
            </div>
          )}
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isHighRated && (
              <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {language === 'ar' ? 'تقييم عالي' : 'Top Rated'}
              </div>
            )}
            {isMostOrdered && (
              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {language === 'ar' ? 'الأكثر طلباً' : 'Most Ordered'}
              </div>
            )}
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full border border-primary/30 shadow-lg">
            <span className="font-display text-lg">{formatPrice(item.price)}</span>
            <span className="font-display text-xs ml-1 text-muted-foreground">IQD</span>
          </div>

          {/* Availability Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <span className="font-display text-xl text-destructive">
                {language === 'ar' ? 'غير متوفر' : 'Not Available'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-display text-xl text-foreground group-hover:text-gradient transition-all duration-300">
                {displayName}
              </h3>
              {language === 'en' && item.nameAr && (
                <p className="text-sm text-muted-foreground" dir="rtl">{item.nameAr}</p>
              )}
            </div>
            <Sparkles className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
            {displayDesc}
          </p>

          {/* Add to Cart */}
          {item.isAvailable && (
            <div className="flex items-center justify-between">
              {quantity > 0 ? (
                <div className="flex items-center gap-4 w-full justify-center">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="p-3 rounded-full bg-secondary hover:bg-destructive/20 hover:text-destructive transition-all duration-300 active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display text-2xl w-12 text-center text-primary">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="p-3 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-300 active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl
                             font-display text-sm transition-all duration-300 hover:shadow-[var(--shadow-fire)] hover:scale-[1.02] active:scale-95
                             relative overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <ShoppingCart className="w-5 h-5" />
                  {isAdded ? t('menu.added') : t('menu.addToCart')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;