import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();
  const { theme } = useTheme();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let styleClass = '';

        if (theme === 'dark') {
          switch (toast.type) {
            case 'success':
              styleClass = 'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-xl';
              break;
            case 'error':
              styleClass = 'bg-slate-900/95 border-rose-500/50 text-rose-300 shadow-xl';
              break;
            case 'warning':
              styleClass = 'bg-slate-900/95 border-amber-500/50 text-amber-300 shadow-xl';
              break;
            default:
              styleClass = 'bg-slate-900/95 border-blue-500/50 text-blue-300 shadow-xl';
              break;
          }
        } else {
          switch (toast.type) {
            case 'success':
              styleClass = 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-md';
              break;
            case 'error':
              styleClass = 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-md';
              break;
            case 'warning':
              styleClass = 'bg-amber-50/95 border-amber-200 text-amber-950 shadow-md';
              break;
            default:
              styleClass = 'bg-blue-50/95 border-blue-200 text-blue-950 shadow-md';
              break;
          }
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-right duration-200 transition-all ${styleClass}`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              {toast.type === 'error' && <AlertCircle size={16} className="text-rose-500 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
              {toast.type === 'info' && <Info size={16} className="text-blue-500 shrink-0" />}
              <span className="text-xs font-semibold leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/10 text-current/60 hover:text-current transition-colors cursor-pointer shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
