import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
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
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const currentDisplay = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = currentDisplay >= starValue;
        const isHalf = !isFilled && currentDisplay >= starValue - 0.5;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`transition-all duration-150 ${
              interactive
                ? 'cursor-pointer hover:scale-110 active:scale-95 focus:outline-none'
                : 'cursor-default'
            }`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-600 fill-slate-800'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
