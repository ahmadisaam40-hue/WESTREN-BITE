import { useState } from 'react';
import { Save, Eye, Printer } from 'lucide-react';
import { useReceiptStore } from '@/store/receiptStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const ReceiptDesigner = () => {
  const { template, updateTemplate } = useReceiptStore();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    toast({
      title: 'Saved',
      description: 'Receipt template has been saved.',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sampleOrder = {
    id: 'order-123456',
    customerName: 'Ahmed Ali',
    customerPhone: '+964 770 123 4567',
    orderType: 'delivery' as const,
    deliveryAddress: 'Baghdad, Al-Mansour',
    items: [
      { id: '1', name: 'Classic Western Burger', nameAr: 'برجر ويسترن كلاسيك', quantity: 2, price: 12000 },
      { id: '2', name: 'Loaded Fries', nameAr: 'بطاطس محملة', quantity: 1, price: 6000 },
    ],
    totalAmount: 30000,
    createdAt: new Date(),
  };

  const printSampleReceipt = () => {
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
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Sample Receipt</title>
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
        </style>
      </head>
      <body>
        <div class="header">
          ${template.showLogo ? '<img class="logo" src="' + logo + '" alt="Logo">' : ''}
          <div class="restaurant-name">${template.restaurantName}</div>
          <div>${template.address}</div>
          <div>${template.phone}</div>
        </div>
        <div class="divider"></div>
        <div class="order-number">#${sampleOrder.id.slice(-6).toUpperCase()}</div>
        <div>Name: ${sampleOrder.customerName}</div>
        <div>Phone: ${sampleOrder.customerPhone}</div>
        <div class="divider"></div>
        ${sampleOrder.items.map(item => `
          <div class="item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)} IQD</span>
          </div>
        `).join('')}
        <div class="divider"></div>
        <div class="item total">
          <span>Total</span>
          <span>${formatPrice(sampleOrder.totalAmount)} IQD</span>
        </div>
        ${template.showFooterMessage ? `
          <div class="footer">
            <div class="divider"></div>
            <p>${template.footerMessage}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    printDocument.open();
    printDocument.write(receiptHtml);
    printDocument.close();

    setTimeout(() => {
      printFrame.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl">Receipt Template Designer</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={printSampleReceipt}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Test Print
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-6">
          {/* Logo Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <Label className="flex items-center gap-2">
              Show Logo on Receipt
            </Label>
            <Switch
              checked={template.showLogo}
              onCheckedChange={(checked) => updateTemplate({ showLogo: checked })}
            />
          </div>

          {/* Restaurant Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Restaurant Name (English)</Label>
              <Input
                value={template.restaurantName}
                onChange={(e) => updateTemplate({ restaurantName: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>اسم المطعم (عربي)</Label>
              <Input
                value={template.restaurantNameAr}
                onChange={(e) => updateTemplate({ restaurantNameAr: e.target.value })}
                className="mt-2"
                dir="rtl"
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Address (English)</Label>
              <Input
                value={template.address}
                onChange={(e) => updateTemplate({ address: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>العنوان (عربي)</Label>
              <Input
                value={template.addressAr}
                onChange={(e) => updateTemplate({ addressAr: e.target.value })}
                className="mt-2"
                dir="rtl"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label>Phone Number</Label>
            <Input
              value={template.phone}
              onChange={(e) => updateTemplate({ phone: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Footer Message */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <Label>Show Footer Message</Label>
            <Switch
              checked={template.showFooterMessage}
              onCheckedChange={(checked) => updateTemplate({ showFooterMessage: checked })}
            />
          </div>

          {template.showFooterMessage && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Footer Message (English)</Label>
                <Textarea
                  value={template.footerMessage}
                  onChange={(e) => updateTemplate({ footerMessage: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>رسالة التذييل (عربي)</Label>
                <Textarea
                  value={template.footerMessageAr}
                  onChange={(e) => updateTemplate({ footerMessageAr: e.target.value })}
                  className="mt-2"
                  dir="rtl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-white text-black p-6 rounded-lg font-mono text-sm max-w-[300px] mx-auto">
            <div className="text-center mb-4">
              {template.showLogo && (
                <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-2" />
              )}
              <div className="font-bold text-lg">{template.restaurantName}</div>
              <div className="text-xs">{template.address}</div>
              <div className="text-xs">{template.phone}</div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3" />

            <div className="text-center font-bold text-lg mb-3">
              #{sampleOrder.id.slice(-6).toUpperCase()}
            </div>

            <div className="text-xs mb-2">
              <div>Name: {sampleOrder.customerName}</div>
              <div>Phone: {sampleOrder.customerPhone}</div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3" />

            {sampleOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs mb-1">
                <span>{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <div className="border-t border-dashed border-gray-400 my-3" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(sampleOrder.totalAmount)} IQD</span>
            </div>

            {template.showFooterMessage && (
              <>
                <div className="border-t border-dashed border-gray-400 my-3" />
                <div className="text-center text-xs">{template.footerMessage}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptDesigner;
