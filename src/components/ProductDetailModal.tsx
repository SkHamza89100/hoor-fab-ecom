import React, { useEffect, useState } from 'react';
import {
  Check,
  HelpCircle,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Product } from '../types/store';
import {
  buildProductInquiryWhatsAppUrl,
  buildSingleProductWhatsAppUrl,
  getEffectivePrice,
} from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';
import { FashionImage } from './FashionImage';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { settings, addToCart, setIsCartOpen } = useStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      setSelectedSize(product.sizes[0] || 'Standard');
      setQuantity(1);
      setAddedFeedback(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const effectivePrice = getEffectivePrice(product);
  const hasDiscount =
    typeof product.salePrice === 'number' &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const images =
    product.images && product.images.length > 0 ? product.images : [''];

  const handleAddToOrderList = () => {
    addToCart(product, selectedSize, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#FAF7F2] text-[#141311] border border-[#C9A96E]/40 shadow-2xl grid grid-cols-1 md:grid-cols-12"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-[#0B0B0C]/80 hover:bg-[#0B0B0C] text-[#F7F3EB] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:col-span-6 bg-[#121214] p-4 sm:p-6 flex flex-col justify-between">
          <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#0B0B0C] border border-[#C9A96E]/25">
            <FashionImage
              src={images[selectedImageIdx]}
              alt={`${product.name} view ${selectedImageIdx + 1}`}
              fallbackTitle={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#C9A96E] scale-105'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <FashionImage
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E6556] font-medium">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  product.available
                    ? 'text-emerald-800 font-semibold'
                    : 'text-red-700 font-semibold'
                }
              >
                {product.available ? 'In Stock & Ready to Ship' : 'Out of Stock'}
              </span>
            </div>

            <h2
              id="pdp-modal-title"
              className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#141311] leading-snug"
            >
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 font-tabular">
              <span className="text-2xl sm:text-3xl font-bold text-[#141311]">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-[#7D7465] line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-[#9E6B24] uppercase tracking-wider">
                    Special Offer
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#3E3930] leading-relaxed">
              {product.description}
            </p>

            <div className="pt-2 border-t border-[#E5DEC9] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#7D7465] block uppercase tracking-wider">
                  Color
                </span>
                <span className="font-semibold text-[#141311] mt-0.5 block">
                  {product.color || 'Signature Shade'}
                </span>
              </div>
              <div>
                <span className="text-[#7D7465] block uppercase tracking-wider">
                  Fabric &amp; Craft
                </span>
                <span className="font-semibold text-[#141311] mt-0.5 block">
                  {product.fabric || 'Premium Ethnic Weave'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#141311]">
                  Select Size
                </span>
                <span className="text-xs text-[#6E6556]">
                  Selected: <strong>{selectedSize}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes.length > 0 ? product.sizes : ['Standard']).map(
                  (size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[46px] min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-[#141311] text-[#FAF7F2] ring-2 ring-[#C9A96E]'
                            : 'bg-white border border-[#D8D0BC] text-[#141311] hover:border-[#141311]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#141311]">
                Quantity
              </span>
              <div className="flex items-center border border-[#D8D0BC] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#141311] hover:bg-[#F5F0E6] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center font-tabular text-sm font-semibold text-[#141311]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#141311] hover:bg-[#F5F0E6] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5DEC9] space-y-2.5">
            <a
              href={buildSingleProductWhatsAppUrl(
                product,
                selectedSize,
                quantity,
                settings.whatsappNumber
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-md transition-colors whitespace-nowrap"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
              <span>
                ORDER ON WHATSAPP · ₹
                {(effectivePrice * quantity).toLocaleString('en-IN')}
              </span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAddToOrderList}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#141311]/30 hover:border-[#141311] bg-white text-[#141311] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-800">Added to Order List</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order List</span>
                  </>
                )}
              </button>

              <a
                href={buildProductInquiryWhatsAppUrl(
                  product,
                  selectedSize,
                  settings.whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#141311] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] fill-current shrink-0" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>

            {addedFeedback && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsCartOpen(true);
                  }}
                  className="text-xs font-semibold text-[#8C6528] underline"
                >
                  View Full Order List &amp; Order Multiple Items →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
