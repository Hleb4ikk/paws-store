import { Star } from 'lucide-react';

export default function Stars({ rating, size = 14, showCount = null }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.5;
        return (
          <Star
            key={i}
            size={size}
            className={filled || half ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
          />
        );
      })}
      {showCount !== null && (
        <span className="text-sm text-gray-500 ml-1">({showCount})</span>
      )}
    </div>
  );
}
