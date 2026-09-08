import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgeDefinition } from '../../types';
import {
  Award,
  Plus,
  Power,
  Edit,
  X
} from 'lucide-react';

export const AdminRewardsBadges: React.FC = () => {
  const {
    badgeDefinitions,
    createBadgeDefinition,
    updateBadgeDefinition,
    toggleBadgeActive,
    courses,
    showToast
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeDefinition | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [rarity, setRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('rare');
  const [conditionType, setConditionType] = useState<'quiz_score' | 'course_completion' | 'streak_days' | 'custom'>('quiz_score');
  const [conditionCourseId, setConditionCourseId] = useState(courses[0]?.id || '');
  const [conditionThreshold, setConditionThreshold] = useState(70);
  const [conditionText, setConditionText] = useState('Complete course with quiz score >= 70%');

  const handleOpenCreate = () => {
    setTitle('');
    setDescription('');
    setIcon('🏆');
    setRarity('rare');
    setConditionType('quiz_score');
    setConditionThreshold(70);
    setConditionText('Complete course with quiz score >= 70%');
    setEditingBadge(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (badge: BadgeDefinition) => {
    setEditingBadge(badge);
    setTitle(badge.title);
    setDescription(badge.description);
    setIcon(badge.icon);
    setRarity(badge.rarity);
    setConditionType(badge.conditionType as any);
    setConditionCourseId(badge.conditionCourseId || courses[0]?.id || '');
    setConditionThreshold(badge.conditionThreshold || 70);
    setConditionText(badge.conditionText);
    setIsCreateModalOpen(true);
  };

  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !conditionText.trim()) return;

    if (editingBadge) {
      updateBadgeDefinition(editingBadge.id, {
        title: title.trim(),
        description: description.trim() || conditionText.trim(),
        icon,
        rarity,
        conditionType,
        conditionCourseId,
        conditionThreshold: Number(conditionThreshold),
        conditionText: conditionText.trim()
      });
      showToast(`Badge "${title}" updated.`, 'success');
    } else {
      createBadgeDefinition({
        title: title.trim(),
        description: description.trim() || conditionText.trim(),
        icon,
        rarity,
        conditionType,
        conditionCourseId,
        conditionThreshold: Number(conditionThreshold),
        conditionText: conditionText.trim(),
        isActive: true
      });
      showToast(`Badge "${title}" created!`, 'success');
    }

    setIsCreateModalOpen(false);
  };

  const emojiPresets = ['🏆', '⚡', '🚀', '🎯', '💎', '🧠', '🛡️', '⚙️', '💻', '🏅'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Credentials Authority</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
              Badges & Certificates Only
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Milestone Badges Management</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Configure verifiable achievement badges earned when learners pass evaluations and finish masterclasses.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Create New Badge</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badgeDefinitions.map(badge => (
          <div
            key={badge.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              badge.isActive
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-2xl shadow-2xs">
                  {badge.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  badge.isActive
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {badge.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{badge.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Criteria:</strong>
                <span>{badge.conditionText}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
              <button
                onClick={() => toggleBadgeActive(badge.id)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  badge.isActive
                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                }`}
                title={badge.isActive ? 'Disable Badge' : 'Enable Badge'}
              >
                <Power size={13} />
                <span>{badge.isActive ? 'Deactivate' : 'Activate'}</span>
              </button>
              <button
                onClick={() => handleOpenEdit(badge)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Edit Badge Criteria"
              >
                <Edit size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Badge Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                <h3 className="font-bold text-sm">{editingBadge ? 'Edit Milestone Badge' : 'Create New Milestone Badge'}</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBadge} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Badge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Achiever"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Badge Icon (Emoji)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    className="w-16 p-2 text-center text-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {emojiPresets.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setIcon(em)}
                        className={`p-1.5 rounded-lg border text-base cursor-pointer ${icon === em ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'border-slate-200 dark:border-slate-700'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Unlock Rule & Criteria</label>
                <input
                  type="text"
                  required
                  value={conditionText}
                  onChange={e => setConditionText(e.target.value)}
                  placeholder="e.g. Complete all 5 course reels and score >= 80% on assessment"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingBadge ? 'Save Changes' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
