import React, { useState } from 'react';
import { Reel } from '../../types';
import { Share2, Copy, Check, Twitter, Linkedin, MessageCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ShareModalProps {
  reel: Reel;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ reel, isOpen, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/reel/${reel.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-sm glass-panel bg-slate-900/95 border border-white/15 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-blue-400" />
            <h3 className="font-bold text-base text-white">Share Learning Reel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="py-4">
          <p className="text-xs text-slate-300 font-semibold mb-1 line-clamp-1">{reel.title}</p>
          <p className="text-[11px] text-slate-400 mb-4">By {reel.creatorName} • {reel.category}</p>

          <div className="flex items-center justify-around gap-2 mb-5">
            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=Check out this educational reel: "${reel.title}"&url=${encodeURIComponent(shareUrl)}`, '_blank');
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-800/80 hover:bg-sky-500/20 hover:text-sky-400 text-slate-300 border border-white/10 transition-all"
            >
              <Twitter size={20} />
              <span className="text-[10px]">Twitter / X</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-800/80 hover:bg-blue-500/20 hover:text-blue-400 text-slate-300 border border-white/10 transition-all"
            >
              <Linkedin size={20} />
              <span className="text-[10px]">LinkedIn</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://wa.me/?text=Check out this educational reel: "${reel.title}" ${encodeURIComponent(shareUrl)}`, '_blank');
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 border border-white/10 transition-all"
            >
              <MessageCircle size={20} />
              <span className="text-[10px]">WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-slate-300 flex-1 outline-none px-1 overflow-hidden text-ellipsis"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg gradient-btn-primary text-xs font-bold"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
