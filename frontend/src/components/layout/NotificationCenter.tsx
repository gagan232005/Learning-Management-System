import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  X,
  ExternalLink,
  Filter,
  ArrowRight
} from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    currentUser,
    showToast
  } = useApp();

  const { theme } = useTheme();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'approval' | 'reward' | 'course' | 'mentor'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filtered list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'approval') return n.type === 'approval' || n.title.toLowerCase().includes('approval');
      if (activeFilter === 'reward') return n.type === 'reward' || n.title.toLowerCase().includes('badge') || n.title.toLowerCase().includes('certificate');
      if (activeFilter === 'course') return n.type === 'course' || n.title.toLowerCase().includes('course');
      if (activeFilter === 'mentor') return n.type === 'mentor' || n.title.toLowerCase().includes('mentor') || n.title.toLowerCase().includes('student');
      return true;
    });
  }, [notifications, activeFilter]);

  // Type styling and icon metadata based on notification category & global theme
  const getCategoryMeta = (notif: NotificationItem) => {
    const t = notif.type;
    const title = notif.title.toLowerCase();

    if (t === 'approval' || title.includes('approval') || title.includes('reviewed')) {
      return {
        label: 'Approval',
        icon: <ShieldCheck size={16} className="text-blue-500" />,
        badgeStyle: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        targetTab: currentUser.role === 'admin' ? 'admin-approvals' : 'mentor-notifications'
      };
    }

    if (t === 'reward' || title.includes('badge') || title.includes('certificate')) {
      return {
        label: 'Reward',
        icon: <Award size={16} className="text-amber-500" />,
        badgeStyle: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        targetTab: 'rewards'
      };
    }

    if (t === 'course' || title.includes('course') || title.includes('reel') || title.includes('module')) {
      return {
        label: 'Course',
        icon: <BookOpen size={16} className="text-emerald-500" />,
        badgeStyle: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        targetTab: currentUser.role === 'mentor' ? 'mentor-courses' : 'courses'
      };
    }

    if (t === 'mentor' || title.includes('mentor') || title.includes('student') || title.includes('faculty')) {
      return {
        label: 'Faculty',
        icon: <Users size={16} className="text-blue-500" />,
        badgeStyle: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        targetTab: currentUser.role === 'mentor' ? 'mentor-students' : 'mentor-dashboard'
      };
    }

    return {
      label: 'Update',
      icon: <Bell size={16} className="text-slate-500 dark:text-slate-400" />,
      badgeStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      targetTab: 'home'
    };
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
    showToast('All notifications marked as read', 'success');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    showToast('Notification center cleared', 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full sm:w-[460px] max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                  Notifications
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>

            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear list</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none bg-white dark:bg-slate-900">
          {(['all', 'unread', 'approval', 'reward', 'course', 'mentor'] as const).map(filterKey => {
            const count =
              filterKey === 'all'
                ? notifications.length
                : filterKey === 'unread'
                ? unreadCount
                : notifications.filter(n => {
                    if (filterKey === 'approval') return n.type === 'approval' || n.title.toLowerCase().includes('approval');
                    if (filterKey === 'reward') return n.type === 'reward' || n.title.toLowerCase().includes('badge');
                    if (filterKey === 'course') return n.type === 'course' || n.title.toLowerCase().includes('course');
                    if (filterKey === 'mentor') return n.type === 'mentor' || n.title.toLowerCase().includes('mentor');
                    return false;
                  }).length;

            return (
              <button
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === filterKey
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filterKey} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Notifications Scroll Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/50">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <Bell size={28} className="mx-auto opacity-30" />
              <p className="text-sm font-semibold">No notifications found</p>
              <p className="text-xs opacity-75">You're up to date on all platform updates.</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const meta = getCategoryMeta(notif);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) markNotificationRead(notif.id);
                    if (onNavigateTab && meta.targetTab) {
                      onNavigateTab(meta.targetTab);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    notif.read
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-80 hover:opacity-100'
                      : 'bg-white dark:bg-slate-800/90 border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">{meta.icon}</div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badgeStyle}`}>
                          {meta.label}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>View</span>
                          <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
