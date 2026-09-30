import React, { useState } from 'react';
import {
  Lock,
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateSection: (sectionId: string) => void;
  isAdminRoute: boolean;
  onOpenAdmin: () => void;
  onExitAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateSection,
  isAdminRoute,
  onOpenAdmin,
  onExitAdmin,
}) => {
  const { settings, cart, setIsCartOpen, isAdminAuthenticated } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (sectionId: string) => {
    if (isAdminRoute) {
      onExitAdmin();
      setTimeout(() => onNavigateSection(sectionId), 60);
    } else {
      onNavigateSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  const handleSearchInput = (value: string) => {
    onSearchChange(value);
    if (value.trim().length > 0 && !isAdminRoute) {
      const shopEl = document.getElementById('shop');
      if (shopEl) {
        const rect = shopEl.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.7 || rect.bottom < 0) {
          shopEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#C9A96E]/20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left Brand Logo */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded"
            aria-label="HOOR FAB Home"
          >
            <img
              src={settings.logoIconUrl || '/logo-h-icon.svg'}
              alt="HOOR FAB H Icon"
              referrerPolicy="no-referrer"
              className="h-10 w-10 object-contain lg:hidden"
            />
            <img
              src={settings.logoFullUrl || '/logo-full.svg'}
              alt="HOOR FAB Complete Brand Logo"
              referrerPolicy="no-referrer"
              className="hidden lg:block h-11 w-auto object-contain"
            />
          </button>
        </div>

        {/* Mobile Center Name */}
        <div className="flex lg:hidden items-center justify-center">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="font-serif-display text-lg sm:text-xl font-semibold tracking-[0.22em] text-[#F7F3EB] whitespace-nowrap"
          >
            HOOR FAB
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F7F3EB]/85"
        >
          {[
            { label: 'Home', id: 'home' },
            { label: 'Shop', id: 'shop' },
            { label: 'Collections', id: 'collections' },
            { label: 'New Arrivals', id: 'new-arrivals' },
            { label: 'About', id: 'about' },
            { label: 'Contact', id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="relative py-1 text-[#F7F3EB]/85 hover:text-[#C9A96E] transition-colors whitespace-nowrap shrink-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A96E] hover:after:w-full after:transition-all"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Search, Cart, Admin Panel button, WhatsApp CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin Panel Header Button */}
          <button
            type="button"
            onClick={isAdminRoute ? onExitAdmin : onOpenAdmin}
            aria-label="Open Admin Panel"
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isAdminRoute
                ? 'border-[#C9A96E] bg-[#C9A96E] text-[#0B0B0C]'
                : 'border-[#C9A96E]/40 hover:border-[#C9A96E] bg-white/5 text-[#C9A96E] hover:bg-[#C9A96E]/15'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminRoute ? 'Exit Admin' : 'Admin Panel'}</span>
          </button>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search products"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              searchOpen || searchQuery
                ? 'bg-[#C9A96E]/20 text-[#C9A96E]'
                : 'text-[#F7F3EB]/85 hover:text-[#C9A96E] hover:bg-white/5'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Order list with ${totalCartItems} items`}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-[#F7F3EB]/85 hover:text-[#C9A96E] hover:bg-white/5 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C9A96E] text-[#0B0B0C] font-tabular text-[11px] font-bold flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* WhatsApp Order Button */}
          <a
            href={buildGeneralWhatsAppUrl(undefined, settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>WhatsApp Order</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#F7F3EB] hover:text-[#C9A96E] hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="border-t border-[#C9A96E]/20 bg-[#121214] px-4 py-3">
          <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className="w-4 h-4 text-[#C9A96E] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search Pakistani suits, coord sets, bridal wear, colors..."
              autoFocus
              className="w-full pl-10 pr-20 py-2.5 bg-[#0B0B0C] border border-[#C9A96E]/35 rounded-lg text-sm text-[#F7F3EB] placeholder-[#F7F3EB]/45 focus:outline-none focus:border-[#C9A96E]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-10 text-xs text-[#F7F3EB]/60 hover:text-[#F7F3EB] px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="ml-2 p-1.5 text-[#F7F3EB]/60 hover:text-[#F7F3EB]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C9A96E]/20 bg-[#111113] px-5 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {[
              { label: 'Home', id: 'home' },
              { label: 'Shop Catalog', id: 'shop' },
              { label: 'Collections', id: 'collections' },
              { label: 'New Arrivals', id: 'new-arrivals' },
              { label: 'About HOOR FAB', id: 'about' },
              { label: 'Visit Store & Contact', id: 'contact' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-[#F7F3EB] hover:bg-[#C9A96E]/15 hover:text-[#C9A96E] transition-colors"
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminRoute) onExitAdmin();
                else onOpenAdmin();
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-[#C9A96E] hover:bg-[#C9A96E]/15 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </span>
              <span className="text-xs text-[#F7F3EB]/50">
                {isAdminAuthenticated ? 'Logged in' : 'Sign in'}
              </span>
            </button>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={buildGeneralWhatsAppUrl(undefined, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
              <span>Order on WhatsApp ({settings.whatsappDisplay})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
