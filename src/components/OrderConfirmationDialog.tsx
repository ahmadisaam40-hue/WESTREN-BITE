import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/store/languageStore';
import { Order } from '@/types/menu';
import { useReceiptStore } from '@/store/receiptStore';
import logo from '@/assets/logo.png';

interface OrderConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onBackToMenu: () => void;
}

const OrderConfirmationDialog = ({ open, onClose, order, onBackToMenu }: OrderConfirmationDialogProps) => {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { template } = useReceiptStore();
  const [copied, setCopied] = useState(false);

  const orderNumber = order.id.slice(-6).toUpperCase();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyOrder = () => {
    const orderText = `#${orderNumber}`;

    navigator.clipboard.writeText(orderText);
    setCopied(true);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied',
      description: language === 'ar' ? 'تم نسخ رقم الطلب' : 'Order details copied to clipboard',
    });

    setTimeout(() => setCopied(false), 2000);
  };

  // Print receipt silently - wrapped in useCallback
  const printReceipt = useCallback(() => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!printDocument) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>Receipt #${orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0 auto;
            padding: 10mm;
            font-size: 12px;
          }
          .header { text-align: center; margin-bottom: 10px; }
          .logo { width: 50px; height: 50px; margin: 0 auto 5px; }
          .restaurant-name { font-size: 18px; font-weight: bold; margin: 5px 0; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .order-number { font-size: 16px; font-weight: bold; text-align: center; margin: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-size: 14px; font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; margin-top: 15px; font-size: 11px; }
          .customer-info { margin: 10px 0; }
          .qr-section { text-align: center; margin: 15px 0; }
          .qr-section img { width: 100px; height: 100px; margin: 0 auto; }
          .qr-section p { font-size: 10px; margin-top: 5px; color: #666; }
          @media print {
            body { margin: 0; padding: 5mm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${template.showLogo ? '<img class="logo" src="' + logo + '" alt="Logo">' : ''}
          <div class="restaurant-name">${language === 'ar' ? template.restaurantNameAr : template.restaurantName}</div>
          <div>${language === 'ar' ? template.addressAr : template.address}</div>
          <div>${template.phone}</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="order-number">#${orderNumber}</div>
        
        <div class="customer-info">
          <div><strong>${language === 'ar' ? 'الاسم' : 'Name'}:</strong> ${order.customerName}</div>
          <div><strong>${language === 'ar' ? 'الهاتف' : 'Phone'}:</strong> ${order.customerPhone}</div>
          <div><strong>${language === 'ar' ? 'النوع' : 'Type'}:</strong> ${order.orderType === 'delivery' ? (language === 'ar' ? 'توصيل' : 'Delivery') : (language === 'ar' ? 'استلام' : 'Pickup')}</div>
          ${order.deliveryAddress ? `<div><strong>${language === 'ar' ? 'العنوان' : 'Address'}:</strong> ${order.deliveryAddress}</div>` : ''}
          ${order.pickupTime ? `<div><strong>${language === 'ar' ? 'وقت الاستلام' : 'Pickup Time'}:</strong> ${order.pickupTime}</div>` : ''}
        </div>
        
        <div class="divider"></div>
        
        ${order.items.map(item => `
          <div class="item">
            <span>${language === 'ar' && item.nameAr ? item.nameAr : item.name} x${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)} IQD</span>
          </div>
        `).join('')}
        
        <div class="divider"></div>
        
        <div class="item total">
          <span>${language === 'ar' ? 'المجموع' : 'Total'}</span>
          <span>${formatPrice(order.totalAmount)} IQD</span>
        </div>
        
        ${template.showFooterMessage ? `
          <div class="footer">
            <div class="divider"></div>
            <p>${language === 'ar' ? template.footerMessageAr : template.footerMessage}</p>
          </div>
        ` : ''}
        <div class="divider"></div>
        
        <div class="qr-section">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + '/track/' + order.id)}" alt="QR Code" />
          <p>${language === 'ar' ? 'امسح الكود لتتبع طلبك' : 'Scan to track your order'}</p>
        </div>
        
        <div class="footer">
          <div>${new Date(order.createdAt).toLocaleString('en-IQ')}</div>
        </div>
      </body>
      </html>
    `;

    printDocument.open();
    printDocument.write(receiptHtml);
    printDocument.close();

    // Wait for content to load then print
    setTimeout(() => {
      printFrame.contentWindow?.print();
      // Remove frame after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 250);
  }, [language, order, orderNumber, template]);

  // Auto-print removed so the dialog doesn't pop up on customer's device
  /*
  useEffect(() => {
    if (open) {
      const timer = setTimeout(printReceipt, 500);
      return () => clearTimeout(timer);
    }
  }, [open, printReceipt]);
  */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#252525] border-[#333] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display text-primary">
            {language === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>

          <p className="text-muted-foreground mb-2">
            {language === 'ar' ? 'رقم الطلب' : 'Order Number'}
          </p>
          <div className="text-4xl font-display text-primary mb-6">
            #{orderNumber}
          </div>

          <div className="flex flex-col items-center justify-center mb-6">
            <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <QRCodeSVG
                value={`${window.location.origin}/track/${order.id}`}
                size={140}
                fgColor="#F67E18"
                bgColor="#ffffff"
                imageSettings={{
                  src: logo,
                  x: undefined,
                  y: undefined,
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 font-body tracking-wide">
              {language === 'ar' ? 'امسح الكود لتتبع طلبك' : 'Scan code to track order'}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleCopyOrder}
              variant="outline"
              className="gap-2 border-[#444] hover:bg-[#333]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied
                ? (language === 'ar' ? 'تم النسخ' : 'Copied!')
                : (language === 'ar' ? 'نسخ الطلب' : 'Copy Order')
              }
            </Button>
          </div>
        </div>

        <Button
          onClick={onBackToMenu}
          className="w-full bg-primary hover:bg-primary/90 gap-2"
        >
          <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          {language === 'ar' ? 'العودة للقائمة' : 'Back to Menu'}
        </Button>
      </DialogContent>
    </Dialog >
  );
};

export default OrderConfirmationDialog;
