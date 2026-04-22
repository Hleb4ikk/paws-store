import { createContext, useContext, useState, useRef, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});
  const pausedRef = useRef(false);

  const removeToast = useCallback((id) => {
    // Очищаем таймер
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type, timestamp: new Date() };
    
    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Храним максимум 3 последних уведомления
      return updated.slice(0, 3);
    });

    // Создаем таймер для автоматического удаления только если не на паузе
    if (!pausedRef.current) {
      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, 3000);
    }
  }, [removeToast]);

  const pauseToasts = useCallback(() => {
    pausedRef.current = true;
    // Очищаем все активные таймеры
    Object.keys(timersRef.current).forEach(id => {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    });
  }, []);

  const resumeToasts = useCallback(() => {
    pausedRef.current = false;
    // Возобновляем таймеры для всех текущих уведомлений
    setToasts(currentToasts => {
      currentToasts.forEach(toast => {
        if (!timersRef.current[toast.id]) {
          timersRef.current[toast.id] = setTimeout(() => {
            removeToast(toast.id);
          }, 3000);
        }
      });
      return currentToasts;
    });
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, pauseToasts, resumeToasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
