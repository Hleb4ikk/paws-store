import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Check, X, Trash2, Tag } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Check size={16} />,
    error: <X size={16} />,
    remove: <Trash2 size={16} />,
    promo: <Tag size={16} />
  };

  return createPortal(
    <div className="fixed bottom-[50px] right-[50px] z-50 animate-slide-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex items-center gap-3 min-w-[300px]">
        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 text-white">
          {icons[type]}
        </div>
        <p className="text-gray-900 font-medium text-sm flex-1">{message}</p>
      </div>
    </div>,
    document.body
  );
}
