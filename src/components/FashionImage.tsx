import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface FashionImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export const FashionImage: React.FC<FashionImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#181614] via-[#121110] to-[#0B0B0C] text-[#C9A96E] p-4 text-center overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-3 border border-[#C9A96E]/25 rounded-lg pointer-events-none" />
        <Sparkles className="w-7 h-7 mb-2 text-[#C9A96E]/70 stroke-[1.25]" />
        <span className="font-serif-display text-xs tracking-widest uppercase text-[#F7F3EB]/85 line-clamp-2 px-2">
          {fallbackTitle || alt || 'HOOR FAB Couture'}
        </span>
        <span className="text-[10px] tracking-wider uppercase text-[#C9A96E]/60 mt-1">
          HOOR FAB
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
