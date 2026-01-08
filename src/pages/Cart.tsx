import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, Store, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationPicker from '@/components/LocationPicker';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog';
import RatingDialog from '@/components/RatingDialog';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useTranslation } from '@/store/languageStore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, OrderType } from '@/types/menu';
import logo from '@/assets/logo.png';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { addOrder, getOrderById } = useOrderStore();
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLat, setDeliveryLat] = useState(33.3152);
  const [deliveryLng, setDeliveryLng] = useState(44.3661);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Auto-detect location for delivery
  useEffect(() => {
    if (orderType === 'delivery' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeliveryLat(pos.coords.latitude);
          setDeliveryLng(pos.coords.longitude);
        },
        () => {
          // Use default Baghdad coordinates
        }
      );
    }
  }, [orderType]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price) + ' د.ع';
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setDeliveryLat(lat);
    setDeliveryLng(lng);
    setDeliveryAddress(address);
  };

  // Generate pickup time slots
  const getPickupTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Start from next 30-minute interval
    let startHour = currentHour;
    let startMinute = currentMinute < 30 ? 30 : 0;
    if (currentMinute >= 30) startHour++;
    
    // Add minimum 30 min preparation time
    startMinute += 30;
    if (startMinute >= 60) {
      startMinute -= 60;
      startHour++;
    }
    
    for (let i = 0; i < 10; i++) {
      const hour = (startHour + Math.floor((startMinute + i * 30) / 60)) % 24;
      const minute = (startMinute + i * 30) % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
    
    return slots;
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast({
        title: t('customer.nameRequired'),
        description: t('customer.nameRequiredDesc'),
        variant: 'destructive',
      });
      return;
    }

    if (!customerPhone.trim()) {
      toast({
        title: t('customer.phoneRequired'),
        description: t('customer.phoneRequiredDesc'),
        variant: 'destructive',
      });
      return;
    }

    if (!orderType) {
      toast({
        title: t('order.selectOrderType'),
        variant: 'destructive',
      });
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast({
        title: t('customer.addressRequired'),
        description: t('customer.addressRequiredDesc'),
        variant: 'destructive',
      });
      return;
    }

    if (orderType === 'pickup' && !pickupTime) {
      toast({
        title: t('order.selectPickupTime'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = addOrder({
        items: items,
        customerName,
        customerPhone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        deliveryLat: orderType === 'delivery' ? deliveryLat : undefined,
        deliveryLng: orderType === 'delivery' ? deliveryLng : undefined,
        pickupTime: orderType === 'pickup' ? pickupTime : undefined,
        totalAmount: getTotalPrice(),
        status: 'pending',
        notes: customerNotes,
      });

      // Get the order for the confirmation dialog
      const order = getOrderById(orderId);
      if (order) {
        setConfirmedOrder(order);
        setShowConfirmation(true);
      }
      
      clearCart();
    } catch (error: any) {
      console.error('Order submission error:', error);
      
      // If quota exceeded, clear old orders and retry
      if (error?.name === 'QuotaExceededError' || error?.message?.includes('quota')) {
        try {
          localStorage.removeItem('western-bite-orders');
          // Retry the order
          const orderId = addOrder({
            items: items,
            customerName,
            customerPhone,
            orderType,
            deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
            deliveryLat: orderType === 'delivery' ? deliveryLat : undefined,
            deliveryLng: orderType === 'delivery' ? deliveryLng : undefined,
            pickupTime: orderType === 'pickup' ? pickupTime : undefined,
            totalAmount: getTotalPrice(),
            status: 'pending',
            notes: customerNotes,
          });
          
          const order = getOrderById(orderId);
          if (order) {
            setConfirmedOrder(order);
            setShowConfirmation(true);
          }
          clearCart();
          return;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
      
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show empty cart only if no order is being confirmed/rated
  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="font-display text-3xl text-foreground mb-4">
              {t('cart.empty')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('cart.emptyDesc')}
            </p>
            <Link to="/menu" className="btn-western inline-block">
              {t('cart.browseMenu')}
            </Link>
          </div>
        </section>

        <Footer />
        
        {/* Keep dialogs visible even with empty cart */}
        {confirmedOrder && (
          <OrderConfirmationDialog
            open={showConfirmation}
            onClose={() => {
              setShowConfirmation(false);
              setShowRating(true);
            }}
            order={confirmedOrder}
            onBackToMenu={() => {
              setShowConfirmation(false);
              setShowRating(true);
            }}
          />
        )}
        
        {confirmedOrder && (
          <RatingDialog
            open={showRating}
            onClose={() => {
              setShowRating(false);
              setConfirmedOrder(null);
              navigate('/menu');
            }}
            order={confirmedOrder}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333] py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link
            to="/menu"
            className="p-2 rounded-full hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 text-white ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
          
          <div className="flex items-center gap-3">
            <img src={logo} alt="Western Bite" className="w-10 h-10 rounded-full" />
            <span className="font-display text-xl text-primary">{t('cart.payment')}</span>
          </div>
        </div>
      </header>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Right Column - Contact Info & Order Type */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Contact Information */}
              <div className="bg-[#252525] rounded-xl p-6 border border-[#333]">
                <h2 className="font-display text-xl text-white mb-6 text-right">
                  {t('customer.contactInfo')}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white text-right block mb-2">
                      {t('customer.name')}
                    </Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('customer.namePlaceholder')}
                      className="bg-[#333] border-[#444] text-white placeholder:text-gray-500 text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white text-right block mb-2">
                      {t('customer.phone')}
                    </Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={t('customer.phonePlaceholder')}
                      className="bg-[#333] border-[#444] text-white placeholder:text-gray-500 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Order Type */}
              <div className="bg-[#252525] rounded-xl p-6 border border-[#333]">
                <h2 className="font-display text-xl text-white mb-6 text-right">
                  {t('order.type')}
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                      orderType === 'pickup'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-[#444] bg-[#333] text-white hover:border-[#555]'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    <span>{t('order.pickup')}</span>
                  </button>
                  
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                      orderType === 'delivery'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-[#444] bg-[#333] text-white hover:border-[#555]'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span>{t('order.delivery')}</span>
                  </button>
                </div>

                {/* Pickup Time Selection */}
                {orderType === 'pickup' && (
                  <div className="mt-4">
                    <Label className="text-white text-right flex items-center gap-2 mb-2 justify-end">
                      <Clock className="w-4 h-4" />
                      {t('order.pickupTime')}
                    </Label>
                    <Select value={pickupTime} onValueChange={setPickupTime}>
                      <SelectTrigger className="bg-[#333] border-[#444] text-white">
                        <SelectValue placeholder={t('order.selectTime')} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333] border-[#444]">
                        {getPickupTimeSlots().map((time) => (
                          <SelectItem 
                            key={time} 
                            value={time}
                            className="text-white hover:bg-[#444]"
                          >
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Delivery Location */}
                {orderType === 'delivery' && (
                  <div className="mt-4">
                    <Label className="text-white text-right block mb-2">
                      {t('customer.location')}
                    </Label>
                    <LocationPicker 
                      onLocationSelect={handleLocationSelect}
                      initialLat={deliveryLat}
                      initialLng={deliveryLng}
                    />
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="bg-[#252525] rounded-xl p-6 border border-[#333]">
                <h2 className="font-display text-xl text-white mb-4 text-right">
                  {t('customer.notes')}
                </h2>
                <Textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={t('customer.notesPlaceholder')}
                  className="bg-[#333] border-[#444] text-white placeholder:text-gray-500 text-right min-h-[100px]"
                />
              </div>
            </div>

            {/* Left Column - Order Summary */}
            <div className="order-2 lg:order-1">
              <div className="bg-[#252525] rounded-xl p-6 border border-[#333] sticky top-8">
                <h2 className="font-display text-xl text-white mb-6 text-right">
                  {t('cart.summary')}
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-4 border-b border-[#333]"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#333]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <img src={logo} alt="Western Bite" className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow text-right">
                        <h3 className="text-white font-medium">
                          {language === 'ar' && item.nameAr ? item.nameAr : item.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {t('cart.quantity')}: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-primary font-display">
                        {formatPrice(item.price * item.quantity)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded bg-[#333] hover:bg-[#444] transition-colors"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded bg-[#333] hover:bg-[#444] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-[#333] mb-6">
                  <span className="text-primary font-display text-xl">
                    {formatPrice(getTotalPrice())}
                  </span>
                  <span className="text-white font-display text-lg">
                    {t('cart.total')}
                  </span>
                </div>

                {/* Confirm Button */}
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display text-lg py-6"
                >
                  {isSubmitting ? t('cart.placing') : t('cart.placeOrder')}
                </Button>

                {/* Cash on Delivery Badge */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {t('cart.cashOnDelivery')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Confirmation Dialog */}
      {confirmedOrder && (
        <OrderConfirmationDialog
          open={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setShowRating(true);
          }}
          order={confirmedOrder}
          onBackToMenu={() => {
            setShowConfirmation(false);
            setShowRating(true);
          }}
        />
      )}

      {/* Rating Dialog - shows after confirmation */}
      {confirmedOrder && (
        <RatingDialog
          open={showRating}
          onClose={() => {
            setShowRating(false);
            setConfirmedOrder(null);
            navigate('/menu');
          }}
          order={confirmedOrder}
        />
      )}
    </div>
  );
};

export default Cart;