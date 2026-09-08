import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, X, ChevronRight } from 'lucide-react';

interface NotificationBannerBarProps {
  onOpenCenter: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationBannerBar: React.FC<NotificationBannerBarProps> = ({
  onOpenCenter,
  onNavigateTab
}) => {
  const { notifications } = useApp();
  const { theme } = useTheme();
  const [isDismissed, setIsDismissed] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  const latestUnread = unreadNotifs[0];

  if (isDismissed || !latestUnread) return null;

  return (
    <div className="w-full px-4 py-2 text-xs transition-all duration-200 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 text-slate-800 dark:text-slate-200 border-b border-blue-200/80 dark:border-blue-900/40 shadow-xs">
      <div
        onClick={onOpenCenter}
        className="flex items-center gap-2.5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-1"
      >
        <span className="p-1 rounded-lg shrink-0 flex items-center justify-center bg-blue-600 text-white shadow-2xs">
          <Bell size={13} className="animate-pulse" />
        </span>

        <div className="flex items-center gap-2 truncate">
          <span className="font-extrabold uppercase text-[10px] px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border border-blue-300/40 dark:border-blue-700/40 tracking-wider">
            {latestUnread.type || 'Notice'}
          </span>
          <span className="font-bold truncate text-slate-900 dark:text-white">{latestUnread.title}</span>
          <span className="opacity-70 truncate hidden sm:inline">— {latestUnread.message}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenCenter}
          className="px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all cursor-pointer"
        >
          <span>View ({unreadNotifs.length})</span>
          <ChevronRight size={12} />
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          title="Dismiss Bar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
