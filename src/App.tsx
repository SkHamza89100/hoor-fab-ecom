import React, { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { AboutAndStoreSection } from './components/AboutAndStoreSection';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CollectionShowcase } from './components/CollectionShowcase';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StoreProvider, useStore } from './context/StoreContext';
import { Product } from './types/store';
import { getEffectivePrice } from './utils/whatsapp';

const StorefrontContent: React.FC = () => {
  const { products, collections } = useStore();

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#/admin'
    );
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [priceRange, setPriceRange] = useState<
    'all' | 'under-2000' | '2000-5000' | 'above-5000'
  >('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllFeatured, setShowAllFeatured] = useState(true);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    const checkRoute = () => {
      const isAdm =
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#/admin';
      setIsAdminRoute(isAdm);
    };
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const openAdminPortal = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      window.location.hash = '#/admin';
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitAdminPortal = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCollection = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setShowAllFeatured(false);
    scrollToSection('shop');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSize('All');
    setPriceRange('all');
    setOnlyInStock(false);
    setShowAllFeatured(false);
  };

  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      if (
        selectedCategory !== 'All' &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.color.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      const effectivePrice = getEffectivePrice(product);
      if (priceRange === 'under-2000' && effectivePrice >= 2000) return false;
      if (
        priceRange === '2000-5000' &&
        (effectivePrice < 2000 || effectivePrice > 5000)
      )
        return false;
      if (priceRange === 'above-5000' && effectivePrice <= 5000) return false;

      if (onlyInStock && !product.available) return false;

      return true;
    });
  }, [
    activeProducts,
    selectedCategory,
    searchQuery,
    selectedSize,
    priceRange,
    onlyInStock,
  ]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    selectedSize !== 'All' ||
    priceRange !== 'all' ||
    onlyInStock;

  const displayedCatalogProducts = useMemo(() => {
    if (hasActiveFilters || !showAllFeatured) {
      return filteredProducts;
    }
    const featuredOnes = filteredProducts.filter((p) => p.featured);
    return featuredOnes.length > 0 ? featuredOnes : filteredProducts;
  }, [filteredProducts, hasActiveFilters, showAllFeatured]);

  const newArrivalProducts = useMemo(
    () => activeProducts.filter((p) => p.newArrival),
    [activeProducts]
  );

  const categoryTabs = useMemo(() => {
    const base = [
      'All',
      'Pakistani Suits',
      'Coord Sets',
      'Daily Wear',
      'Party Wear',
      'Bridal Wear',
    ];
    collections.forEach((c) => {
      if (!base.includes(c.name)) base.push(c.name);
    });
    return base;
  }, [collections]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#F7F3EB]">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) setShowAllFeatured(false);
        }}
        onNavigateSection={scrollToSection}
        isAdminRoute={isAdminRoute}
        onOpenAdmin={openAdminPortal}
        onExitAdmin={exitAdminPortal}
      />

      {isAdminRoute ? (
        <main className="flex-1">
          <AdminDashboard onBackToStore={exitAdminPortal} />
        </main>
      ) : (
        <main className="flex-1">
          <HeroSection onShopNow={() => scrollToSection('shop')} />

          <CollectionShowcase
            selectedCategory={selectedCategory}
            onSelectCollection={handleSelectCollection}
          />

          <section
            id="shop"
            className="py-12 sm:py-16 bg-[#0B0B0C] border-b border-white/10"
          >
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#C9A96E] font-medium">
                    HOOR FAB Catalog
                  </div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F7F3EB] mt-1">
                    {selectedCategory === 'All'
                      ? 'Featured Collection'
                      : selectedCategory}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-[#C9A96E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowAllFeatured(false);
                      }}
                      placeholder="Search name or category..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141417] border border-white/15 text-xs sm:text-sm text-[#F7F3EB] placeholder-[#F7F3EB]/45 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMobileFilters((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      showMobileFilters ||
                      selectedSize !== 'All' ||
                      priceRange !== 'all' ||
                      onlyInStock
                        ? 'border-[#C9A96E] bg-[#C9A96E]/15 text-[#C9A96E]'
                        : 'border-white/15 bg-[#141417] text-[#F7F3EB]/80 hover:border-[#C9A96E]/60'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {categoryTabs.map((category) => {
                    const active =
                      selectedCategory.toLowerCase() === category.toLowerCase();
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          if (category !== 'All') {
                            setShowAllFeatured(false);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#C9A96E] text-[#0B0B0C]'
                            : 'bg-[#141417] text-[#F7F3EB]/75 hover:text-[#F7F3EB] border border-white/10'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                {selectedCategory === 'All' && !hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => setShowAllFeatured((prev) => !prev)}
                    className="hidden sm:inline-flex text-xs font-medium text-[#C9A96E] hover:underline whitespace-nowrap shrink-0"
                  >
                    {showAllFeatured
                      ? `View All ${activeProducts.length} Styles`
                      : 'Show Featured Edit'}
                  </button>
                )}
              </div>

              {showMobileFilters && (
                <div className="p-4 rounded-xl bg-[#141417] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C9A96E] mb-1.5">
                      Filter by Size
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'All',
                        'XS',
                        'S',
                        'M',
                        'L',
                        'XL',
                        'XXL',
                        'Free Size',
                      ].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-2.5 py-1 rounded text-xs font-medium ${
                            selectedSize === sz
                              ? 'bg-[#C9A96E] text-[#0B0B0C] font-semibold'
                              : 'bg-[#0B0B0C] text-[#F7F3EB]/75 border border-white/10'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C9A96E] mb-1.5">
                      Price Range
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) =>
                        setPriceRange(
                          e.target.value as
                            | 'all'
                            | 'under-2000'
                            | '2000-5000'
                            | 'above-5000'
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0B0C] border border-white/15 text-xs text-[#F7F3EB]"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-2000">Under ₹2,000</option>
                      <option value="2000-5000">₹2,000 – ₹5,000</option>
                      <option value="above-5000">Above ₹5,000</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-between">
                    <label className="block text-[11px] uppercase tracking-wider text-[#C9A96E] mb-1.5">
                      Availability
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-xs text-[#F7F3EB] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyInStock}
                          onChange={(e) => setOnlyInStock(e.target.checked)}
                          className="accent-[#C9A96E] w-4 h-4"
                        />
                        <span>In Stock Only</span>
                      </label>

                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="inline-flex items-center gap-1 text-xs text-[#C9A96E] hover:underline"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {displayedCatalogProducts.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-[#131316] border border-white/10 p-6 space-y-3">
                  <Filter className="w-8 h-8 text-[#C9A96E] mx-auto stroke-[1.5]" />
                  <h3 className="font-serif-display text-xl font-semibold text-[#F7F3EB]">
                    No Matching Styles Found
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7F3EB]/65 max-w-md mx-auto">
                    Try clearing your search or selecting another collection to
                    explore all available HOOR FAB outfits.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-[#C9A96E] text-[#0B0B0C] text-xs font-semibold uppercase tracking-wider"
                  >
                    Show All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
                  {displayedCatalogProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(prod) => setActiveProduct(prod)}
                    />
                  ))}
                </div>
              )}

              {selectedCategory === 'All' &&
                !hasActiveFilters &&
                activeProducts.length > displayedCatalogProducts.length && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAllFeatured(false)}
                      className="px-6 py-3 rounded-lg border border-[#C9A96E]/60 hover:bg-[#C9A96E] text-[#F7F3EB] hover:text-[#0B0B0C] text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      View Complete Catalog ({activeProducts.length} Styles)
                    </button>
                  </div>
                )}
            </div>
          </section>

          {newArrivalProducts.length > 0 && (
            <section
              id="new-arrivals"
              className="py-12 sm:py-16 bg-[#0E0E10] border-b border-white/10"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[#C9A96E] font-medium">
                      Just Landed
                    </div>
                    <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F7F3EB] mt-1">
                      New Arrivals
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F7F3EB]/65">
                    Fresh seasonal additions curated for festive and daily
                    elegance.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
                  {newArrivalProducts.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(prod) => setActiveProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <AboutAndStoreSection />
        </main>
      )}

      <Footer
        onNavigateSection={(id) => {
          if (isAdminRoute) {
            exitAdminPortal();
            setTimeout(() => scrollToSection(id), 60);
          } else {
            scrollToSection(id);
          }
        }}
        onOpenAdmin={openAdminPortal}
      />

      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />

      <CartDrawer />

      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
