import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  BookOpen,
  Users,
  Award,
  Trash2,
  CheckCheck,
  ShieldCheck,
  ArrowRight,
  Clock
} from 'lucide-react';

interface MentorNotificationsViewProps {
  onNavigateToCourses?: () => void;
  onNavigateToStudents?: () => void;
}

export const MentorNotificationsView: React.FC<MentorNotificationsViewProps> = ({
  onNavigateToCourses,
  onNavigateToStudents
}) => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    showToast
  } = useApp();

  const { theme } = useTheme();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'approval' | 'course' | 'student'>('all');

  // Relative time helper
  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const now = new Date().getTime();
      const date = new Date(isoString).getTime();
      const diffSecs = Math.max(0, Math.floor((now - date) / 1000));
      if (diffSecs < 60) return 'Just now';
      const mins = Math.floor(diffSecs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recent';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'approval') return n.type === 'approval' || n.title.toLowerCase().includes('approval');
      if (activeFilter === 'course') return n.type === 'course' || n.title.toLowerCase().includes('course');
      if (activeFilter === 'student') return n.type === 'mentor' || n.title.toLowerCase().includes('student');
      return true;
    });
  }, [notifications, activeFilter]);

  const getCategoryMeta = (notif: NotificationItem) => {
    const t = notif.type;
    const title = notif.title.toLowerCase();

    if (t === 'approval' || title.includes('approval') || title.includes('reviewed')) {
      return {
        label: 'Course Approval',
        icon: <ShieldCheck size={18} className="text-blue-500" />,
        badgeStyle: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      };
    }
    if (t === 'course' || title.includes('course')) {
      return {
        label: 'Curriculum Update',
        icon: <BookOpen size={18} className="text-emerald-500" />,
        badgeStyle: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      };
    }
    if (t === 'reward' || title.includes('badge')) {
      return {
        label: 'Achievement',
        icon: <Award size={18} className="text-amber-500" />,
        badgeStyle: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      };
    }
    if (t === 'mentor' || title.includes('student')) {
      return {
        label: 'Learner Activity',
        icon: <Users size={18} className="text-indigo-500" />,
        badgeStyle: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
      };
    }
    return {
      label: 'General Notice',
      icon: <Bell size={18} className="text-slate-500" />,
      badgeStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bell size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Mentor Notification Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live updates on student enrollments, course approvals, and assignment submissions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              notifications.forEach(n => { if (!n.read) markNotificationRead(n.id); });
              showToast('All notifications marked as read', 'success');
            }}
            disabled={unreadCount === 0}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
          >
            <CheckCheck size={14} />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={() => {
              clearAllNotifications();
              showToast('Notifications cleared', 'info');
            }}
            disabled={notifications.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear List</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'unread', 'approval', 'course', 'student'] as const).map(filterKey => (
          <button
            key={filterKey}
            onClick={() => setActiveFilter(filterKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              activeFilter === filterKey
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {filterKey} {filterKey === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <Bell size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Notifications In This Filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You are completely caught up with all curriculum alerts and learner progress notifications.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const meta = getCategoryMeta(notif);
            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) markNotificationRead(notif.id);
                  if (notif.type === 'course' && onNavigateToCourses) onNavigateToCourses();
                  if (notif.type === 'mentor' && onNavigateToStudents) onNavigateToStudents();
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.read
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-80 hover:opacity-100'
                    : 'bg-white dark:bg-slate-800/80 border-blue-300 dark:border-blue-700/60 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {meta.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badgeStyle}`}>
                        {meta.label}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    <span>{getRelativeTime(notif.createdAt)}</span>
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
