import React from 'react';
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildCartWhatsAppUrl, getEffectivePrice } from '../utils/whatsapp';
import { FashionImage } from './FashionImage';
import { WhatsAppIcon } from './WhatsAppIcon';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
  } = useStore();

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="WhatsApp Order List"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-[#FAF7F2] text-[#141311] flex flex-col justify-between shadow-2xl border-l border-[#C9A96E]/35"
      >
        <div className="px-5 py-4 bg-[#0B0B0C] text-[#F7F3EB] flex items-center justify-between border-b border-[#C9A96E]/25">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C9A96E]" />
            <div>
              <h2 className="font-serif-display text-lg font-semibold">
                Your Order List
              </h2>
              <p className="text-[11px] text-[#F7F3EB]/65">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected for
                WhatsApp order
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Order List"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#F7F3EB]/75 hover:text-[#F7F3EB] hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-[#141311]/5 flex items-center justify-center mb-3 text-[#8C6528]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-xl font-semibold text-[#141311]">
                Your Order List is Empty
              </h3>
              <p className="text-xs text-[#6E6556] mt-1.5 max-w-xs leading-relaxed">
                Add multiple suits, coord sets, or bridal styles here to send one
                combined order message on WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#141311] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = getEffectivePrice(item.product);
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white border border-[#E5DEC9] flex gap-3.5 items-center"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#121214] shrink-0">
                    <FashionImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-display text-sm font-semibold text-[#141311] truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-[#6E6556] mt-0.5 flex items-center gap-2">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span className="font-tabular font-semibold text-[#141311]">
                        ₹{unitPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D8D0BC] rounded-md bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease item quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#141311] hover:bg-black/5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-tabular text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase item quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#141311] hover:bg-black/5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="p-1.5 text-[#8C7A6B] hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E5DEC9] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#6E6556] font-semibold">
                Estimated Total
              </span>
              <span className="font-tabular text-xl font-bold text-[#141311]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <a
              href={buildCartWhatsAppUrl(cart, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-md transition-colors whitespace-nowrap"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
              <span>Order All on WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-[#6E6556]">
              <span>No online payment required</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-[#8C6528] hover:underline font-medium"
              >
                Clear List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
