import React from 'react';
import { Eye, Plus } from 'lucide-react';
import { Product } from '../types/store';
import {
  buildSingleProductWhatsAppUrl,
  getEffectivePrice,
} from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';
import { FashionImage } from './FashionImage';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const { settings, addToCart, setIsCartOpen } = useStore();

  const effectivePrice = getEffectivePrice(product);
  const hasDiscount =
    typeof product.salePrice === 'number' &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - effectivePrice) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Standard';
    addToCart(product, defaultSize, 1);
    setIsCartOpen(true);
  };

  return (
    <article
      onClick={() => onViewDetails(product)}
      className="group rounded-xl overflow-hidden bg-[#FAF7F2] text-[#141311] border border-[#E5DEC9] flex flex-col transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="relative aspect-[3/4] w-full bg-[#141311] overflow-hidden">
        <FashionImage
          src={product.images[0]}
          alt={`${product.name} - ${product.category} by HOOR FAB`}
          fallbackTitle={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {product.available && (
          <button
            type="button"
            onClick={handleQuickAdd}
            title="Add to WhatsApp Order List"
            aria-label={`Add ${product.name} to order list`}
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-lg bg-[#0B0B0C]/80 hover:bg-[#C9A96E] text-[#F7F3EB] hover:text-[#0B0B0C] flex items-center justify-center transition-colors backdrop-blur-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {!product.available && (
          <div className="absolute inset-x-0 bottom-0 bg-[#0B0B0C]/85 text-[#F7F3EB] py-1.5 px-3 text-center text-[11px] uppercase tracking-widest font-medium">
            Currently Out of Stock
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] uppercase tracking-wider text-[#6E6556] font-medium">
            <span className="truncate">{product.category}</span>
            {hasDiscount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#9E6B24] font-semibold">
                  Save {discountPercent}%
                </span>
              </>
            )}
            {!hasDiscount && product.newArrival && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#8C6528] font-semibold">New Arrival</span>
              </>
            )}
          </div>

          <h3 className="font-serif-display text-sm sm:text-base font-semibold text-[#141311] mt-1 line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2 font-tabular">
            <span className="text-base sm:text-lg font-bold text-[#141311]">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#7D7465] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="mt-2 text-[11px] text-[#5C5447] flex items-center gap-1 flex-wrap">
            <span className="text-[#827869]">Sizes:</span>
            <span className="font-medium text-[#2A2621]">
              {product.sizes.length > 0 ? product.sizes.join(' · ') : 'Free Size'}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E6DFC8] flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-[#141311]/20 hover:border-[#141311] text-[#141311] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>View Details</span>
          </button>

          <a
            href={buildSingleProductWhatsAppUrl(
              product,
              product.sizes[0],
              1,
              settings.whatsappNumber
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};
