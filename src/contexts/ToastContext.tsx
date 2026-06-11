import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 dark:bg-green-500/20 border-green-500 text-green-600 dark:text-green-400',
          icon: CheckCircle2,
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 dark:bg-red-500/20 border-red-500 text-red-600 dark:text-red-400',
          icon: AlertCircle,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400',
          icon: Info,
        };
    }
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Container untuk me-render Toast Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const { bg, icon: Icon } = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg border shadow-lg backdrop-blur-md ${bg}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className="flex-shrink-0" />
                  <p className="text-sm font-medium">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};