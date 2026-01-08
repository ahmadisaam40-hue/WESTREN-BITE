import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Born in the West',
    'hero.subtitle': 'Experience authentic Western flavors in the heart of Iraq. Sizzling steaks, gourmet burgers, and more await you.',
    'hero.viewMenu': 'View Our Menu',
    'hero.orderNow': 'Order Now',
    
    // Features
    'features.title': 'Why Choose Us',
    'features.cuisine': 'Authentic Western Cuisine',
    'features.cuisineDesc': 'Experience the bold flavors of the Wild West with our carefully crafted dishes.',
    'features.quality': 'Premium Quality',
    'features.qualityDesc': 'We use only the finest ingredients to ensure every bite is memorable.',
    'features.delivery': 'Fast Delivery',
    'features.deliveryDesc': 'Hot and fresh meals delivered to your doorstep quickly.',
    'features.ordering': 'Easy Ordering',
    'features.orderingDesc': 'Order online with precise location tracking for hassle-free delivery.',
    
    // Menu
    'menu.title': 'Our Menu',
    'menu.subtitle': 'Explore our delicious Western-inspired dishes',
    'menu.all': 'All',
    'menu.noItems': 'No items available in this category.',
    'menu.featured': 'Featured Dishes',
    'menu.featuredSubtitle': 'Explore our most popular Western delights',
    'menu.viewFull': 'View Full Menu',
    'menu.addToCart': 'Add to Cart',
    'menu.added': 'Added!',
    
    // Cart & Checkout
    'cart.title': 'Your Cart',
    'cart.empty': 'Your Cart is Empty',
    'cart.emptyDesc': "Looks like you haven't added any items yet.",
    'cart.browseMenu': 'Browse Menu',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.delivery': 'Delivery',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.complete': 'Complete Your Order',
    'cart.back': 'Back to Cart',
    'cart.placeOrder': 'Confirm Order',
    'cart.placing': 'Placing Order...',
    'cart.payment': 'Checkout',
    'cart.cashOnDelivery': 'Cash on Delivery',
    'cart.quantity': 'Quantity',
    
    // Customer Info
    'customer.contactInfo': 'Contact Information',
    'customer.name': 'Full Name',
    'customer.namePlaceholder': 'Enter your name',
    'customer.phone': 'Phone Number',
    'customer.phonePlaceholder': '07XX XXX XXXX',
    'customer.location': 'Delivery Location',
    'customer.notes': 'Special Instructions',
    'customer.notesPlaceholder': 'Any allergies or special requests?',
    'customer.nameRequired': 'Name required',
    'customer.nameRequiredDesc': 'Please enter your name.',
    'customer.phoneRequired': 'Phone required',
    'customer.phoneRequiredDesc': 'Please enter your phone number.',
    'customer.addressRequired': 'Address required',
    'customer.addressRequiredDesc': 'Please select your delivery location on the map.',
    'customer.orderSuccess': 'Order placed successfully!',
    'customer.orderSuccessDesc': 'Your order has been sent. We will contact you shortly.',
    
    // Order Type
    'order.type': 'Order Type',
    'order.delivery': 'Delivery',
    'order.pickup': 'Pick Up',
    'order.pickupTime': 'Pickup Time',
    'order.selectTime': 'Select a time',
    'order.selectOrderType': 'Please select order type',
    'order.selectPickupTime': 'Please select pickup time',
    
    // Location Picker
    'location.selected': 'Selected Address:',
    'location.instruction': 'Click on the map to select your delivery location. Your current location will be detected automatically.',
    'location.loading': 'Loading map...',
    
    // Order Tracking
    'tracking.title': 'Track Your Order',
    'tracking.orderId': 'Order ID',
    'tracking.status': 'Status',
    'tracking.pending': 'Pending',
    'tracking.preparing': 'Preparing',
    'tracking.ready': 'Ready',
    'tracking.delivering': 'On the way',
    'tracking.completed': 'Completed',
    'tracking.cancelled': 'Cancelled',
    'tracking.canModify': 'You can modify your order',
    'tracking.cannotModify': 'Modification time has expired',
    'tracking.timeLeft': 'Time left to modify',
    'tracking.minutes': 'minutes',
    'tracking.modifyOrder': 'Modify Order',
    'tracking.orderDetails': 'Order Details',
    'tracking.notFound': 'Order not found',
    'tracking.enterOrderId': 'Enter your order ID to track',
    'tracking.track': 'Track',
    
    // CTA
    'cta.title': 'Ready to Experience the West?',
    'cta.subtitle': 'Order now and get your favorite Western dishes delivered hot and fresh to your door.',
    
    // Footer
    'footer.about': 'Born in the West, bringing authentic Western flavors to Iraq. Experience the taste of the Wild West with every bite.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.followUs': 'Follow Us',
    'footer.copyright': '© {year} Western Bite. All rights reserved.',
    'footer.admin': 'Admin Panel',
    
    // About
    'about.title': 'About Us',
    'about.story': 'Our Story',
    'about.storyText': 'Western Bite was born from a passion for authentic Western cuisine and a desire to bring these bold, exciting flavors to Iraq. Our journey began with a simple vision: to create a dining experience that transports you to the heart of the American West.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.getInTouch': 'Get in Touch',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.usernamePlaceholder': 'Enter username',
    'admin.passwordPlaceholder': 'Enter password',
    'admin.unlock': 'Login',
    'admin.invalidCredentials': 'Invalid username or password',
    'admin.panel': 'Admin Panel',
    'admin.logout': 'Logout',
    'admin.orders': 'Orders',
    'admin.menuManagement': 'Menu Management',
    'admin.accounting': 'Accounting',
    'admin.settings': 'Settings',
    'admin.pageNotFound': 'Page Not Found',
    'admin.pageNotFoundDesc': "The page you're looking for doesn't exist.",
    'admin.goHome': 'Go Home',
    
    // Language
    'lang.switch': 'العربية',
  },
  ar: {
    // Navbar
    'nav.home': 'الرئيسية',
    'nav.menu': 'القائمة',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    
    // Hero
    'hero.title': 'من قلب الغرب',
    'hero.subtitle': 'استمتع بنكهات الغرب الأصيلة في قلب العراق. ستيك مشوي، برجر فاخر، والمزيد في انتظارك.',
    'hero.viewMenu': 'شاهد قائمتنا',
    'hero.orderNow': 'اطلب الآن',
    
    // Features
    'features.title': 'لماذا تختارنا',
    'features.cuisine': 'مطبخ غربي أصيل',
    'features.cuisineDesc': 'استمتع بالنكهات الجريئة من الغرب الأمريكي مع أطباقنا المعدة بعناية.',
    'features.quality': 'جودة ممتازة',
    'features.qualityDesc': 'نستخدم فقط أجود المكونات لضمان أن كل لقمة لا تُنسى.',
    'features.delivery': 'توصيل سريع',
    'features.deliveryDesc': 'وجبات ساخنة وطازجة تصل إلى باب منزلك بسرعة.',
    'features.ordering': 'طلب سهل',
    'features.orderingDesc': 'اطلب عبر الإنترنت مع تتبع موقعك بدقة لتوصيل بدون متاعب.',
    
    // Menu
    'menu.title': 'قائمتنا',
    'menu.subtitle': 'اكتشف أطباقنا اللذيذة المستوحاة من الغرب',
    'menu.all': 'الكل',
    'menu.noItems': 'لا توجد عناصر متاحة في هذه الفئة.',
    'menu.featured': 'أطباق مميزة',
    'menu.featuredSubtitle': 'اكتشف أشهر أطباقنا الغربية',
    'menu.viewFull': 'شاهد القائمة الكاملة',
    'menu.addToCart': 'أضف للسلة',
    'menu.added': 'تمت الإضافة!',
    
    // Cart & Checkout
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتك فارغة',
    'cart.emptyDesc': 'يبدو أنك لم تضف أي عناصر بعد.',
    'cart.browseMenu': 'تصفح القائمة',
    'cart.summary': 'ملخص الطلب',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.delivery': 'التوصيل',
    'cart.free': 'مجاني',
    'cart.total': 'المجموع',
    'cart.checkout': 'إتمام الطلب',
    'cart.complete': 'أكمل طلبك',
    'cart.back': 'العودة للسلة',
    'cart.placeOrder': 'تأكيد الطلب',
    'cart.placing': 'جاري الطلب...',
    'cart.payment': 'الدفع',
    'cart.cashOnDelivery': 'الدفع عند الاستلام',
    'cart.quantity': 'الكمية',
    
    // Customer Info
    'customer.contactInfo': 'معلومات الاتصال',
    'customer.name': 'الاسم الكامل',
    'customer.namePlaceholder': 'أدخل اسمك',
    'customer.phone': 'رقم الهاتف',
    'customer.phonePlaceholder': '07XX XXX XXXX',
    'customer.location': 'موقع التوصيل',
    'customer.notes': 'تعليمات خاصة',
    'customer.notesPlaceholder': 'أي حساسية أو طلبات خاصة؟',
    'customer.nameRequired': 'الاسم مطلوب',
    'customer.nameRequiredDesc': 'يرجى إدخال اسمك.',
    'customer.phoneRequired': 'الهاتف مطلوب',
    'customer.phoneRequiredDesc': 'يرجى إدخال رقم هاتفك.',
    'customer.addressRequired': 'العنوان مطلوب',
    'customer.addressRequiredDesc': 'يرجى تحديد موقع التوصيل على الخريطة.',
    'customer.orderSuccess': 'تم الطلب بنجاح!',
    'customer.orderSuccessDesc': 'تم إرسال طلبك. سنتواصل معك قريباً.',
    
    // Order Type
    'order.type': 'نوع الطلب',
    'order.delivery': 'توصيل',
    'order.pickup': 'استلام',
    'order.pickupTime': 'وقت الاستلام',
    'order.selectTime': 'اختر وقتاً',
    'order.selectOrderType': 'يرجى اختيار نوع الطلب',
    'order.selectPickupTime': 'يرجى اختيار وقت الاستلام',
    
    // Location Picker
    'location.selected': 'العنوان المحدد:',
    'location.instruction': 'انقر على الخريطة لتحديد موقع التوصيل. سيتم اكتشاف موقعك الحالي تلقائياً.',
    'location.loading': 'جاري تحميل الخريطة...',
    
    // Order Tracking
    'tracking.title': 'تتبع طلبك',
    'tracking.orderId': 'رقم الطلب',
    'tracking.status': 'الحالة',
    'tracking.pending': 'قيد الانتظار',
    'tracking.preparing': 'قيد التحضير',
    'tracking.ready': 'جاهز',
    'tracking.delivering': 'في الطريق',
    'tracking.completed': 'مكتمل',
    'tracking.cancelled': 'ملغي',
    'tracking.canModify': 'يمكنك تعديل طلبك',
    'tracking.cannotModify': 'انتهى وقت التعديل',
    'tracking.timeLeft': 'الوقت المتبقي للتعديل',
    'tracking.minutes': 'دقيقة',
    'tracking.modifyOrder': 'تعديل الطلب',
    'tracking.orderDetails': 'تفاصيل الطلب',
    'tracking.notFound': 'الطلب غير موجود',
    'tracking.enterOrderId': 'أدخل رقم طلبك للتتبع',
    'tracking.track': 'تتبع',
    
    // CTA
    'cta.title': 'هل أنت مستعد لتجربة الغرب؟',
    'cta.subtitle': 'اطلب الآن واحصل على أطباقك الغربية المفضلة ساخنة وطازجة إلى باب منزلك.',
    
    // Footer
    'footer.about': 'من قلب الغرب، نجلب لك نكهات الغرب الأصيلة إلى العراق. استمتع بطعم الغرب الأمريكي مع كل لقمة.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.followUs': 'تابعنا',
    'footer.copyright': '© {year} ويسترن بايت. جميع الحقوق محفوظة.',
    'footer.admin': 'لوحة الإدارة',
    
    // About
    'about.title': 'من نحن',
    'about.story': 'قصتنا',
    'about.storyText': 'ولد ويسترن بايت من شغف بالمطبخ الغربي الأصيل ورغبة في جلب هذه النكهات الجريئة والمثيرة إلى العراق. بدأت رحلتنا برؤية بسيطة: خلق تجربة طعام تنقلك إلى قلب الغرب الأمريكي.',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.getInTouch': 'تواصل معنا',
    
    // Admin
    'admin.login': 'تسجيل دخول المدير',
    'admin.username': 'اسم المستخدم',
    'admin.password': 'كلمة المرور',
    'admin.usernamePlaceholder': 'أدخل اسم المستخدم',
    'admin.passwordPlaceholder': 'أدخل كلمة المرور',
    'admin.unlock': 'تسجيل الدخول',
    'admin.invalidCredentials': 'اسم المستخدم أو كلمة المرور غير صحيحة',
    'admin.panel': 'لوحة الإدارة',
    'admin.logout': 'تسجيل الخروج',
    'admin.orders': 'الطلبات',
    'admin.menuManagement': 'إدارة القائمة',
    'admin.accounting': 'المحاسبة',
    'admin.settings': 'الإعدادات',
    'admin.pageNotFound': 'الصفحة غير موجودة',
    'admin.pageNotFoundDesc': 'الصفحة التي تبحث عنها غير موجودة.',
    'admin.goHome': 'الرئيسية',
    
    // Language
    'lang.switch': 'English',
  },
};

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Create a separate translate function
export const translate = (key: string, language: Language): string => {
  return translations[language][key] || key;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'western-bite-language',
    }
  )
);

// Custom hook that provides the translate function
export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  return { t, language };
};