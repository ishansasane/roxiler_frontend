
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  interactive = false,
  onRatingChange,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const displayedRating = Math.max(
    0,
    Math.min(maxStars, hoverRating ?? rating)
  );

  const handleRating = (value: number) => {
    if (interactive) {
      onRatingChange?.(value);
    }
  };

  return (
    <div
      className="inline-flex items-center gap-1"
      role={interactive ? 'group' : 'img'}
      aria-label={
        interactive
          ? `Select a rating, current rating ${rating} out of ${maxStars}`
          : `${rating} out of ${maxStars} stars`
      }
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const fillAmount = Math.max(
          0,
          Math.min(1, displayedRating - index)
        );

        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            tabIndex={interactive ? 0 : -1}
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
            aria-pressed={interactive ? rating === starValue : undefined}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => {
              if (interactive) setHoverRating(starValue);
            }}
            onMouseLeave={() => {
              if (interactive) setHoverRating(null);
            }}
            onFocus={() => {
              if (interactive) setHoverRating(starValue);
            }}
            onBlur={() => setHoverRating(null)}
            onKeyDown={(event) => {
              if (!interactive) return;

              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                handleRating(Math.min(maxStars, starValue + 1));
              } else if (
                event.key === 'ArrowLeft' ||
                event.key === 'ArrowDown'
              ) {
                event.preventDefault();
                handleRating(Math.max(1, starValue - 1));
              }
            }}
            className={`rounded-sm transition-colors ${interactive
                ? 'cursor-pointer hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#191c22]'
                : 'cursor-default'
              }`}
          >
            <span className="relative block">
              <Star
                className={`${sizeClasses[size]} text-slate-600`}
                strokeWidth={1.7}
              />

              {fillAmount > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillAmount * 100}%` }}
                >
                  <Star
                    className={`${sizeClasses[size]} max-w-none fill-amber-400 text-amber-400`}
                    strokeWidth={1.7}
                  />
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
