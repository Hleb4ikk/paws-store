import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Check, X, Trash2, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast, pauseToasts, resumeToasts } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  if (toasts.length === 0) return null;

  const icons = {
    success: <Check size={24} />,
    error: <X size={24} />,
    remove: <Trash2 size={24} />,
    promo: <Tag size={24} />
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    pauseToasts();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    resumeToasts();
  };

  return createPortal(
    <div 
      className="fixed bottom-[50px] right-[50px] z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        {toasts.map((toast, index) => {
          const isLatest = index === 0;
          const stackOffset = isHovered ? index * 80 : index * 8;
          const scale = isHovered ? 1 : 1 - (index * 0.05);
          const opacity = isHovered ? 1 : (index === 0 ? 1 : 0.7);
          
          return (
            <div
              key={toast.id}
              className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] transition-all duration-300"
              style={{
                transform: `translateY(-${stackOffset}px) scale(${scale})`,
                opacity: opacity,
                zIndex: toasts.length - index,
                transformOrigin: 'bottom right'
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 text-white">
                {icons[toast.type]}
              </div>
              <p className="text-gray-900 font-medium text-sm flex-1">{toast.message}</p>
              {isHovered && (
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
