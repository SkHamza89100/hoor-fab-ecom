import React from 'react';
import { Lock, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenAdmin,
}) => {
  const { settings, isAdminAuthenticated } = useStore();

  return (
    <footer className="bg-[#080809] border-t border-[#C9A96E]/25 text-[#F7F3EB]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <img
              src={settings.logoFullUrl || '/logo-full.svg'}
              alt="HOOR FAB Complete Logo"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain"
            />
            <p className="text-xs sm:text-sm text-[#F7F3EB]/70 max-w-sm leading-relaxed">
              Premium Indian &amp; Urdu-inspired women&apos;s fashion. Explore
              Pakistani suits, coord sets, daily wear, party wear, and bridal
              couture with direct WhatsApp ordering.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-[#F7F3EB]/80">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Shop', id: 'shop' },
                { label: 'Collections', id: 'collections' },
                { label: 'New Arrivals', id: 'new-arrivals' },
                { label: 'About', id: 'about' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigateSection(link.id)}
                    className="hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={buildGeneralWhatsAppUrl(
                    'Hello HOOR FAB, I am reaching out from your website and would like to inquire about your collection.',
                    settings.whatsappNumber
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:text-[#1EBE5D] hover:underline inline-flex items-center gap-2 font-medium transition-colors"
                >
                  <WhatsAppIcon variant="green-badge" className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">
              Store &amp; Direct Order
            </h3>
            <div className="space-y-2.5 text-sm text-[#F7F3EB]/80">
              <a
                href={buildGeneralWhatsAppUrl(
                  'Hello HOOR FAB, I want to inquire about Pakistani suits and place an order.',
                  settings.whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/50 text-[#F7F3EB] hover:text-white transition-all text-xs font-medium group"
              >
                <WhatsAppIcon variant="green-badge" className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Chat &amp; Order: {settings.whatsappDisplay}</span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-1" />
                <span>
                  Amtala Regent Super Market,
                  <br />
                  1st Floor, Shop No. 22,
                  <br />
                  Amtala, West Bengal, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-4 text-xs text-[#F7F3EB]/55">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C9A96E]/30 text-xs text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors"
            title="Open HOOR FAB Admin Panel"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="font-semibold">Store Admin Panel ({isAdminAuthenticated ? 'Active' : 'Login'})</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
