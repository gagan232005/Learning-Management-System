import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Trash2, Flag, Heart, X, ShieldAlert } from 'lucide-react';

interface CommentSheetProps {
  reelId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({ reelId, isOpen, onClose }) => {
  const { comments, addComment, deleteComment, flagComment, currentUser } = useApp();
  const [inputText, setInputText] = useState('');
  const [flaggingId, setFlaggingId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');

  if (!isOpen) return null;

  const reelComments = comments.filter(c => c.reelId === reelId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addComment(reelId, inputText);
      setInputText('');
    }
  };

  const handleReport = (commentId: string) => {
    if (flagReason.trim()) {
      flagComment(commentId, flagReason);
      setFlaggingId(null);
      setFlagReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full sm:max-w-md h-[80vh] sm:h-[650px] bg-slate-900/95 glass-panel border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400" />
            <h3 className="font-bold text-base text-white">
              Discussion ({reelComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {reelComments.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <MessageSquare size={36} className="mx-auto mb-2 opacity-30 text-indigo-400" />
              <p className="text-sm font-medium">No comments yet.</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to share your learning insight or ask a question!</p>
            </div>
          ) : (
            reelComments.map(comment => (
              <div
                key={comment.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  comment.isFlagged
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-7 h-7 rounded-full object-cover border border-white/15"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">{comment.userName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Flag button */}
                    {!comment.isFlagged && (
                      <button
                        onClick={() => setFlaggingId(comment.id)}
                        title="Report comment"
                        className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                      >
                        <Flag size={12} />
                      </button>
                    )}

                    {/* Admin Delete Action */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        title="Admin Moderation: Delete comment"
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{comment.content}</p>

                {comment.isFlagged && (
                  <div className="mt-2 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert size={12} />
                    <span>Flagged for moderation: {comment.flagReason || 'Inappropriate content'}</span>
                  </div>
                )}

                {/* Report Form inline */}
                {flaggingId === comment.id && (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
                    <p className="text-[11px] font-semibold text-amber-300 mb-1.5">Report this comment:</p>
                    <input
                      type="text"
                      placeholder="Reason (e.g. spam, misinformation, hate speech)..."
                      value={flagReason}
                      onChange={e => setFlagReason(e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setFlaggingId(null)}
                        className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReport(comment.id)}
                        className="text-[10px] bg-amber-500 hover:bg-amber-600 text-black font-bold px-2.5 py-0.5 rounded-md"
                      >
                        Submit Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-slate-900/90 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add an insight or question..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 bg-slate-800/90 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl gradient-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
