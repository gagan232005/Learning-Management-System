import React from 'react';
import { Trophy, Award, Flame, Zap, Star, ShieldCheck, X, Crown, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser } = useApp();

  if (!isOpen) return null;

  // Rank users by XP / Points
  const rankedUsers = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <span>Weekly Top Learners</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                  SEASON 1
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by Educational Reels watched & Assessment XP.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current User Level Card */}
        <div className="p-4 m-4 mb-0 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Your Rank</span>
              <h4 className="text-sm font-bold text-white">{currentUser.name}</h4>
              <p className="text-[11px] text-slate-300">Level {currentUser.level || 1} • {currentUser.xp || 0} XP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-700/60 text-center">
              <span className="text-xs font-bold text-amber-400 block flex items-center gap-1">
                <Flame size={12} className="text-amber-400" />
                {currentUser.streakDays || 0}d
              </span>
              <span className="text-[9px] text-slate-400 block font-mono">Streak</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Roster Table */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 custom-scrollbar">
          {rankedUsers.map((user, idx) => {
            const isMe = user.id === currentUser.id;
            const rank = idx + 1;

            return (
              <div
                key={user.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isMe
                    ? 'bg-blue-950/60 border-blue-500/50 shadow-md'
                    : rank === 1
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Indicator */}
                  <div className="w-7 text-center font-bold text-sm">
                    {rank === 1 ? (
                      <Crown size={20} className="text-amber-400 mx-auto" />
                    ) : rank === 2 ? (
                      <span className="text-slate-300 font-extrabold">#2</span>
                    ) : rank === 3 ? (
                      <span className="text-amber-600 font-extrabold">#3</span>
                    ) : (
                      <span className="text-slate-500 text-xs font-mono">#{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-slate-700 text-white font-bold text-xs flex items-center justify-center border border-slate-600 shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                          YOU
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {user.role} • {user.points || 0} pts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-xs font-bold text-amber-400 block">
                      {user.xp || 0} XP
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      Level {user.level || 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
