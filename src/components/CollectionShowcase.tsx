import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionImage } from './FashionImage';

interface CollectionShowcaseProps {
  selectedCategory: string;
  onSelectCollection: (categoryName: string) => void;
}

export const CollectionShowcase: React.FC<CollectionShowcaseProps> = ({
  selectedCategory,
  onSelectCollection,
}) => {
  const { collections, products } = useStore();

  const getCategoryCount = (name: string) =>
    products.filter(
      (p) => p.active && p.category.toLowerCase() === name.toLowerCase()
    ).length;

  return (
    <section
      id="collections"
      className="py-12 sm:py-16 bg-[#0B0B0C] border-b border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F7F3EB] tracking-tight">
              Shop By Collection
            </h2>
            <p className="text-sm sm:text-base text-[#F7F3EB]/70 mt-1.5">
              Find your style for every occasion.
            </p>
          </div>
          <p className="text-xs text-[#C9A96E] uppercase tracking-widest sm:hidden">
            Swipe to explore →
          </p>
        </div>

        {/* Collection Cards Grid (Shopper view only - No upload buttons for visitors) */}
        <div className="flex lg:grid lg:grid-cols-5 gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {collections.map((collection) => {
            const count = getCategoryCount(collection.name);
            const isSelected =
              selectedCategory.toLowerCase() === collection.name.toLowerCase();

            return (
              <div
                key={collection.id}
                onClick={() => onSelectCollection(collection.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCollection(collection.name);
                  }
                }}
                className={`group relative shrink-0 w-[240px] sm:w-[265px] lg:w-auto snap-start rounded-xl overflow-hidden bg-[#141416] border transition-all duration-200 cursor-pointer text-left flex flex-col ${
                  isSelected
                    ? 'border-[#C9A96E] ring-1 ring-[#C9A96E]'
                    : 'border-white/10 hover:border-[#C9A96E]/60'
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#121214]">
                  <FashionImage
                    src={collection.image}
                    alt={`${collection.name} Collection at HOOR FAB`}
                    fallbackTitle={collection.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end pointer-events-none">
                    <div className="text-[11px] text-[#C9A96E] tracking-wider uppercase mb-0.5 font-medium">
                      {count} {count === 1 ? 'Style' : 'Styles'}
                    </div>
                    <h3 className="font-serif-display text-xl font-semibold text-[#F7F3EB] leading-snug">
                      {collection.name}
                    </h3>
                    <p className="text-xs text-[#F7F3EB]/75 line-clamp-1 mt-0.5 mb-3">
                      {collection.subtitle}
                    </p>

                    <span className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-lg bg-[#FAF7F2] group-hover:bg-[#C9A96E] text-[#0B0B0C] text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap pointer-events-auto">
                      <span>Explore Collection</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
