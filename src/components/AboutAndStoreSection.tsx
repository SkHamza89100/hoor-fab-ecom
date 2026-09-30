import React from 'react';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

export const AboutAndStoreSection: React.FC = () => {
  const { settings } = useStore();

  return (
    <>
      <section
        id="about"
        className="py-14 sm:py-20 bg-[#101012] border-t border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-medium">
            Our Heritage &amp; Philosophy
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#F7F3EB]">
            About HOOR FAB
          </h2>

          <p className="text-base sm:text-lg text-[#F7F3EB]/85 leading-relaxed max-w-2xl mx-auto">
            HOOR FAB brings together elegant women&apos;s fashion, everyday
            comfort and occasion-ready styles. From Pakistani suits and coord
            sets to party and bridal wear, we curate styles designed to make
            every moment feel special.
          </p>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#C9A96E]/20 text-left sm:text-center">
            <div>
              <h3 className="font-serif-display text-lg text-[#C9A96E] font-medium">
                Curated Craftsmanship
              </h3>
              <p className="text-xs text-[#F7F3EB]/70 mt-1 leading-relaxed">
                Intricate zardozi, resham, and schiffli embroidery across fine
                lawn, silk, and organza weaves.
              </p>
            </div>
            <div>
              <h3 className="font-serif-display text-lg text-[#C9A96E] font-medium">
                Every Occasion Covered
              </h3>
              <p className="text-xs text-[#F7F3EB]/70 mt-1 leading-relaxed">
                From breathable daily mulmul kurtas to heirloom bridal lehengas
                and modern silk coord sets.
              </p>
            </div>
            <div>
              <h3 className="font-serif-display text-lg text-[#C9A96E] font-medium">
                Direct WhatsApp Concierge
              </h3>
              <p className="text-xs text-[#F7F3EB]/70 mt-1 leading-relaxed">
                Personal sizing guidance, instant stock confirmation, and
                seamless ordering directly on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-14 sm:py-20 bg-[#0B0B0C]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#131316] border border-[#C9A96E]/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[#C9A96E] font-medium">
                  Flagship Boutique
                </div>

                <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#F7F3EB]">
                  Visit Our Store
                </h2>

                <div className="pt-2 space-y-3 text-sm sm:text-base text-[#F7F3EB]/85">
                  <p className="font-serif-display text-xl text-[#C9A96E] font-semibold">
                    {settings.storeName}
                  </p>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                    <address className="not-italic leading-relaxed text-[#F7F3EB]/85">
                      {settings.addressLines.map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </address>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" />
                    <span className="font-tabular text-sm text-[#F7F3EB]/85">
                      WhatsApp &amp; Store Line: {settings.whatsappDisplay}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#C9A96E] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#F7F3EB]/70">
                      Open Daily · 10:30 AM – 9:00 PM IST
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-6 py-3 rounded-lg bg-[#FAF7F2] hover:bg-[#C9A96E] text-[#0B0B0C] font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={buildGeneralWhatsAppUrl(
                    'Hello HOOR FAB, I would like to visit your Amtala Regent Super Market store / inquire about your collection.',
                    settings.whatsappNumber
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] bg-[#0E0E11] border-t lg:border-t-0 lg:border-l border-[#C9A96E]/20 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 400"
              >
                <defs>
                  <pattern
                    id="mapGrid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#C9A96E"
                      strokeWidth="0.6"
                    />
                  </pattern>
                </defs>
                <rect width="600" height="400" fill="url(#mapGrid)" />
                <path
                  d="M 0 220 Q 260 190, 600 140"
                  stroke="#C9A96E"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 290 0 L 310 400"
                  stroke="#C9A96E"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle
                  cx="300"
                  cy="185"
                  r="48"
                  stroke="#C9A96E"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>

              <div className="relative z-10 max-w-sm p-6 rounded-xl bg-[#0B0B0C]/90 border border-[#C9A96E]/40 shadow-xl space-y-2.5">
                <div className="w-11 h-11 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E] text-[#C9A96E] flex items-center justify-center mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="font-serif-display text-lg font-semibold text-[#F7F3EB]">
                  Amtala Regent Super Market
                </p>
                <p className="text-xs text-[#F7F3EB]/75">
                  1st Floor, Shop No. 22 · Amtala, West Bengal, India
                </p>
                <div className="pt-2">
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A96E] hover:underline uppercase tracking-wider"
                  >
                    <span>Open in Google Maps</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
