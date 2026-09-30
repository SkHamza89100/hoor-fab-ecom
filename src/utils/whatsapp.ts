import { CartItem, Product } from '../types/store';

export const WHATSAPP_NUMBER = '918100032281';

export function getEffectivePrice(product: Product): number {
  if (
    typeof product.salePrice === 'number' &&
    product.salePrice > 0 &&
    product.salePrice < product.price
  ) {
    return product.salePrice;
  }
  return product.price;
}

export function buildSingleProductWhatsAppUrl(
  product: Product,
  selectedSize?: string,
  quantity: number = 1,
  phone: string = WHATSAPP_NUMBER
): string {
  const effectivePrice = getEffectivePrice(product);
  const sizeLabel = selectedSize || product.sizes[0] || 'Standard';

  const message = `Hello HOOR FAB,
I want to order:

Product: ${product.name}
Price: ₹${effectivePrice.toLocaleString('en-IN')}
Size: ${sizeLabel}
Quantity: ${quantity}

Please confirm availability and order details.`;

  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryWhatsAppUrl(
  product: Product,
  selectedSize?: string,
  phone: string = WHATSAPP_NUMBER
): string {
  const effectivePrice = getEffectivePrice(product);
  const sizePart = selectedSize ? ` (Size: ${selectedSize})` : '';
  const message = `Hello HOOR FAB,
I would like to ask about this product:

Product: ${product.name}${sizePart}
Category: ${product.category}
Price: ₹${effectivePrice.toLocaleString('en-IN')}

Could you please share more details on availability, measurements, and delivery?`;

  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsAppUrl(
  items: CartItem[],
  phone: string = WHATSAPP_NUMBER
): string {
  if (items.length === 0) {
    return buildGeneralWhatsAppUrl(undefined, phone);
  }

  const lines = items.map((item, idx) => {
    const unitPrice = getEffectivePrice(item.product);
    return `${idx + 1}. ${item.product.name}\nSize: ${item.selectedSize}\nQty: ${item.quantity}\nPrice: ₹${unitPrice.toLocaleString('en-IN')}`;
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
    0
  );

  const message = `Hello HOOR FAB,

I would like to order:

${lines.join('\n\n')}

Estimated Total: ₹${totalAmount.toLocaleString('en-IN')}

Please confirm availability and total amount.`;

  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(
  customMessage?: string,
  phone: string = WHATSAPP_NUMBER
): string {
  const message =
    customMessage ||
    `Hello HOOR FAB, I am browsing your online catalog and would like assistance with placing an order.`;
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
