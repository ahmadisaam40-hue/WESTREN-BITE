import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Truck, Package, XCircle, Store, Edit } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useTranslation } from '@/store/languageStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, canModifyOrder } = useOrderStore();
  const { t, language } = useTranslation();

  const [searchOrderId, setSearchOrderId] = useState(orderId || '');
  const [timeLeft, setTimeLeft] = useState(0);

  const order = orderId ? getOrderById(orderId) : null;
  const canModify = orderId ? canModifyOrder(orderId) : false;

  useEffect(() => {
    if (order) {
      const updateTimeLeft = () => {
        const createdAt = new Date(order.createdAt).getTime();
        const now = Date.now();
        const elapsed = now - createdAt;
        const remaining = Math.max(0, 10 * 60 * 1000 - elapsed);
        setTimeLeft(Math.floor(remaining / 1000 / 60));
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [order]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price) + ' د.ع';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6" />;
      case 'preparing':
        return <Package className="w-6 h-6" />;
      case 'ready':
        return <Store className="w-6 h-6" />;
      case 'delivering':
        return <Truck className="w-6 h-6" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'preparing':
        return 'text-blue-400 bg-blue-400/20';
      case 'ready':
        return 'text-green-400 bg-green-400/20';
      case 'delivering':
        return 'text-purple-400 bg-purple-400/20';
      case 'completed':
        return 'text-green-500 bg-green-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    return t(`tracking.${status}`);
  };

  const statuses = ['pending', 'preparing', 'ready', order?.orderType === 'delivery' ? 'delivering' : null, 'completed'].filter(Boolean) as string[];

  const handleSearch = () => {
    if (searchOrderId.trim()) {
      const cleanId = searchOrderId.trim().replace(/^#/, '');
      navigate(`/track/${cleanId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333] py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 text-white ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Link>

          <div className="flex items-center gap-3">
            <img src={logo} alt="Western Bite" className="w-10 h-10 rounded-full" />
            <span className="font-display text-xl text-primary">{t('tracking.title')}</span>
          </div>
        </div>
      </header>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Search Form */}
          {!orderId && (
            <div className="bg-[#252525] rounded-xl p-6 border border-[#333] mb-8">
              <h2 className="font-display text-xl text-white mb-4 text-center">
                {t('tracking.enterOrderId')}
              </h2>
              <div className="flex gap-4">
                <Input
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder={t('tracking.orderId')}
                  className="bg-[#333] border-[#444] text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                  {t('tracking.track')}
                </Button>
              </div>
            </div>
          )}

          {orderId && !order && (
            <div className="bg-[#252525] rounded-xl p-8 border border-[#333] text-center">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="font-display text-xl text-white mb-2">
                {t('tracking.notFound')}
              </h2>
              <p className="text-gray-400 mb-6">{orderId}</p>
              <Link to="/" className="btn-western inline-block">
                {t('admin.goHome')}
              </Link>
            </div>
          )}

          {order && (
            <>
              {/* Order Status Card */}
              <div className="bg-[#252525] rounded-xl p-6 border border-[#333] mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium">{getStatusText(order.status)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">{t('tracking.orderId')}</p>
                    <p className="text-white font-mono text-sm">{order.id}</p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="relative mb-6">
                  <div className="flex justify-between">
                    {statuses.map((status, index) => {
                      const currentIndex = statuses.indexOf(order.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={status} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-[#333] text-gray-500'
                              } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
                          >
                            {getStatusIcon(status)}
                          </div>
                          <span className={`text-xs ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                            {getStatusText(status)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#333] -z-0">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${(statuses.indexOf(order.status) / (statuses.length - 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Modification Window */}
                {order.status === 'pending' && (
                  <div className={`p-4 rounded-lg ${canModify ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                    {canModify ? (
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-500/20"
                          onClick={() => {/* TODO: Implement modify */ }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('tracking.modifyOrder')}
                        </Button>
                        <div className="text-right">
                          <p className="text-green-400 text-sm">{t('tracking.canModify')}</p>
                          <p className="text-green-300 text-lg font-display">
                            {timeLeft} {t('tracking.minutes')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-400 text-center">{t('tracking.cannotModify')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="bg-[#252525] rounded-xl p-6 border border-[#333]">
                <h3 className="font-display text-lg text-white mb-4 text-right">
                  {t('tracking.orderDetails')}
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#333]">
                      <span className="text-primary">{formatPrice(item.price * item.quantity)}</span>
                      <div className="text-right">
                        <span className="text-white">{language === 'ar' && item.nameAr ? item.nameAr : item.name}</span>
                        <span className="text-gray-400 text-sm mx-2">×{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-[#333]">
                  <span className="text-primary font-display text-xl">{formatPrice(order.totalAmount)}</span>
                  <span className="text-white font-display">{t('cart.total')}</span>
                </div>

                {/* Customer Info */}
                <div className="mt-6 pt-6 border-t border-[#333] space-y-2 text-right">
                  <p className="text-gray-400">
                    <span className="text-white">{order.customerName}</span> :الاسم
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white" dir="ltr">{order.customerPhone}</span> :الهاتف
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white">{order.orderType === 'delivery' ? t('order.delivery') : t('order.pickup')}</span> :نوع الطلب
                  </p>
                  {order.orderType === 'pickup' && order.pickupTime && (
                    <p className="text-gray-400">
                      <span className="text-white">{order.pickupTime}</span> :وقت الاستلام
                    </p>
                  )}
                  {order.orderType === 'delivery' && order.deliveryAddress && (
                    <p className="text-gray-400">
                      <span className="text-white text-sm">{order.deliveryAddress}</span> :العنوان
                    </p>
                  )}
                </div>
              </div>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <Link to="/" className="text-primary hover:underline">
                  {t('admin.goHome')} ←
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;