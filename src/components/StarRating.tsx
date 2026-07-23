import { Star } from 'lucide-react';
import { cn } from './ConfirmModal';

interface StarRatingProps {
  value: number; // 1-5
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readOnly = false, size = 'md' }: StarRatingProps) {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            className={cn(
              "transition-all focus:outline-none p-0.5 rounded",
              !readOnly && "hover:scale-110 cursor-pointer",
              isFilled ? "text-amber-400" : "text-slate-700 hover:text-amber-300"
            )}
            title={readOnly ? `${value} dari 5 bintang` : `Beri ${star} bintang`}
          >
            <Star className={cn(iconSizes[size], isFilled ? "fill-current" : "")} />
          </button>
        );
      })}
    </div>
  );
}
