import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../data/initialCatalog';
import { useStore } from '../context/StoreContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { FashionImage } from './FashionImage';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  onShopNow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  const { settings } = useStore();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0B0B0C] border-b border-[#C9A96E]/20"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          background:
            'radial-gradient(circle at 75% 35%, rgba(201, 169, 110, 0.16), transparent 60%)',
        }}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[#C9A96E] font-medium">
              <span>HOOR FAB</span>
              <span aria-hidden="true">·</span>
              <span>Luxury Women&apos;s Fashion</span>
            </div>

            <h1
              className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F7F3EB] leading-[1.12] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Style That Feels Like You
            </h1>

            <p className="text-base sm:text-lg text-[#F7F3EB]/80 max-w-xl leading-relaxed font-normal">
              Discover elegant women&apos;s fashion at HOOR FAB — from everyday
              essentials to festive and bridal styles.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onShopNow}
                className="min-h-[48px] px-7 py-3.5 rounded-lg bg-[#C9A96E] hover:bg-[#d8b97e] text-[#0B0B0C] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] whitespace-nowrap"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={buildGeneralWhatsAppUrl(
                  'Hello HOOR FAB, I would like to explore your latest collection and place an order.',
                  settings.whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-7 py-3.5 rounded-lg border border-[#25D366]/60 hover:border-[#25D366] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#F7F3EB] font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shadow-sm"
              >
                <WhatsAppIcon variant="green-badge" className="w-5 h-5 shrink-0" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#F7F3EB]/65">
              <span>Pakistani Lawn &amp; Chiffon Suits</span>
              <span aria-hidden="true" className="text-[#C9A96E]">·</span>
              <span>Festive &amp; Bridal Couture</span>
              <span aria-hidden="true" className="text-[#C9A96E]">·</span>
              <span>Direct WhatsApp Ordering</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-[#C9A96E]/35 bg-[#121214] shadow-2xl">
              <FashionImage
                src={settings.heroImageUrl || HERO_BANNER_IMAGE}
                alt="HOOR FAB Ivory Embroidered Organza Pakistani Suit with Bell Sleeves"
                fallbackTitle="HOOR FAB Pakistani Organza Couture"
                priority
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A96E]">
                    Signature Collection
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onShopNow}
                  className="text-xs uppercase tracking-widest text-[#C9A96E] hover:underline whitespace-nowrap ml-3"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
