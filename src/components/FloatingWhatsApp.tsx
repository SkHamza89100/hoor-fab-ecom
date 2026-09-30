import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const whatsappHref = buildGeneralWhatsAppUrl(
    'Hello HOOR FAB, I am browsing your online catalog and would like to place an order or inquire about a dress.',
    settings.whatsappNumber
  );

  return (
    <aside
      id="floating-whatsapp-widget"
      aria-label="WhatsApp Order Concierge"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] flex items-center gap-2.5 sm:gap-3 select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Branded Tooltip 'Order on WhatsApp' - Always visible on both mobile & desktop */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp Concierge"
        className="flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#0D0D10]/95 text-[#F7F3EB] border border-[#C9A96E]/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-[#25D366] hover:scale-105 group"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-80" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
        </span>
        <div className="flex flex-col text-left">
          <span className="text-[11px] sm:text-xs font-bold tracking-wide text-[#F7F3EB] group-hover:text-[#25D366] transition-colors whitespace-nowrap">
            Order on WhatsApp
          </span>
          <span className="hidden sm:inline-block text-[9px] sm:text-[10px] text-[#C9A96E] tracking-wider uppercase font-medium">
            Concierge · {settings.whatsappDisplay}
          </span>
        </div>
      </a>

      {/* Main Floating WhatsApp FAB Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat and Order on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_10px_25px_rgba(37,211,102,0.5)] transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50 group"
      >
        {/* Soft pulse ring */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping -z-10 pointer-events-none"
          style={{ animationDuration: '2.5s' }}
        />

        {/* WhatsApp Icon */}
        <WhatsAppIcon
          variant="white"
          className="w-8 h-8 sm:w-9 sm:h-9 filter drop-shadow group-hover:rotate-6 transition-transform duration-300"
        />

        {/* Live Active Status Badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C9A96E] border-2 border-[#0B0B0C] text-[9px] font-bold text-[#0B0B0C] items-center justify-center">
            ✓
          </span>
        </span>
      </a>
    </aside>
  );
};
