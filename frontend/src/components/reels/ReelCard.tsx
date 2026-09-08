import React, { useState, useEffect, useRef } from 'react';
import { Reel } from '../../types';
import { useApp } from '../../context/AppContext';
import { UniversalReelPlayer } from './UniversalReelPlayer';
import { parseMediaSource } from '../../utils/mediaUtils';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  Check,
  Award,
  Youtube,
  Instagram,
  Video,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CommentSheet } from './CommentSheet';
import { ShareModal } from './ShareModal';

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  reelIndex?: number;
  totalReels?: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  isActive,
  reelIndex = 0,
  totalReels = 5,
  onNext,
  onPrev
}) => {
  const {
    toggleLikeReel,
    toggleBookmarkReel,
    markLearnReelCompleted,
    unmarkLearnReel,
    watchedLearnReelIds
  } = useApp();

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCompleted = watchedLearnReelIds.includes(reel.id);
  const mediaSource = parseMediaSource(reel.videoUrl, isMuted);

  // Trigger controls visibility on user interaction, auto-hide after 2.5s if playing
  const triggerUserInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
    } else {
      triggerUserInteraction();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, reel.id]);

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reel.isLiked) {
      toggleLikeReel(reel.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const toggleCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted) {
      unmarkLearnReel(reel.id);
    } else {
      markLearnReelCompleted(reel.id);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
    triggerUserInteraction();
  };

  return (
    <div
      onMouseMove={triggerUserInteraction}
      onTouchStart={triggerUserInteraction}
      className="relative w-full max-w-[390px] h-[680px] max-h-[calc(100vh-140px)] aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col select-none mx-auto"
    >
      {/* Universal Multi-Source Media Player */}
      <div className="relative flex-1 bg-black overflow-hidden" onDoubleClick={handleDoubleTap}>
        <UniversalReelPlayer
          reel={reel}
          isActive={isActive}
          isMuted={isMuted}
          showControls={showControls}
          onTogglePlayPause={(playing) => {
            setIsPlaying(playing);
            triggerUserInteraction();
          }}
          onAutoWatchComplete={() => {
            if (!isCompleted) {
              markLearnReelCompleted(reel.id);
            }
          }}
          showHeartAnim={showHeartAnim}
        />

        {/* Heart Burst Animation on Double Tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <Heart size={90} className="text-pink-500 fill-pink-500 animate-heart-burst drop-shadow-2xl" />
          </div>
        )}

        {/* Unified Top Navigation & Status Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto">
          {/* Left: Position & Platform Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/15">
              {reelIndex + 1}/{totalReels}
            </span>

            {mediaSource.type === 'youtube' && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600/90 text-white backdrop-blur-md border border-red-400/30 flex items-center gap-1">
                <Youtube size={12} className="fill-white" />
                <span>YouTube</span>
              </span>
            )}

            {mediaSource.type === 'instagram' && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white backdrop-blur-md border border-pink-400/30 flex items-center gap-1">
                <Instagram size={11} />
                <span>Instagram</span>
              </span>
            )}

            {mediaSource.type === 'direct' && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white backdrop-blur-md border border-blue-400/30 flex items-center gap-1">
                <Video size={11} />
                <span>LMS Verified</span>
              </span>
            )}
          </div>

          {/* Right: Actions (Mark Done, Mute, External Link) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mark Done Pill */}
            <button
              onClick={toggleCompletion}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/20'
              }`}
            >
              {isCompleted ? <Check size={12} /> : <CheckCircle2 size={12} />}
              <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              onClick={handleToggleMute}
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center text-white border transition-all shadow-md cursor-pointer ${
                isMuted
                  ? 'bg-black/60 border-white/20 hover:bg-black/80'
                  : 'bg-blue-600/90 border-blue-400/40 hover:bg-blue-600'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            {/* External Platform Link */}
            {mediaSource.originalUrl && (
              <a
                href={mediaSource.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all shadow-md cursor-pointer"
                title={`Open on ${mediaSource.platformName}`}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Right Action Sidebar (Instagram / TikTok Style) */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3.5 z-30 pointer-events-auto">
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeReel(reel.id);
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              reel.isLiked ? 'bg-pink-500/30 text-pink-400 scale-110' : 'bg-black/50 text-white hover:bg-black/70'
            } border border-white/15`}>
              <Heart size={19} className={reel.isLiked ? 'fill-pink-400 text-pink-400' : 'text-white'} />
            </div>
            <span className="text-[10px] font-semibold text-white mt-0.5 drop-shadow">
              {reel.likesCount}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentOpen(true);
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all">
              <MessageCircle size={19} />
            </div>
            <span className="text-[10px] font-semibold text-white mt-0.5 drop-shadow">
              {reel.commentsCount}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmarkReel(reel.id);
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              reel.isBookmarked ? 'bg-amber-500/30 text-amber-300' : 'bg-black/50 text-white hover:bg-black/70'
            } border border-white/15`}>
              <Bookmark size={19} className={reel.isBookmarked ? 'fill-amber-300 text-amber-300' : 'text-white'} />
            </div>
            <span className="text-[10px] font-semibold text-white mt-0.5 drop-shadow">
              Save
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all">
              <Share2 size={19} />
            </div>
            <span className="text-[10px] font-semibold text-white mt-0.5 drop-shadow">
              Share
            </span>
          </button>
        </div>

        {/* Bottom Content Metadata Overlay */}
        <div className="absolute left-3 right-16 bottom-3 z-20 text-left pointer-events-auto p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg space-y-1">
          {/* Creator Profile & Category */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center border border-white/30 shrink-0 shadow-md">
              {reel.creatorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-white drop-shadow">{reel.creatorName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/40 text-blue-200 border border-blue-400/30">
                {reel.category}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white border border-white/20">
                {reel.difficulty}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-bold text-xs sm:text-sm text-white leading-snug drop-shadow line-clamp-2">
            {reel.title}
          </h2>

          {/* Description */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              setIsDescExpanded(!isDescExpanded);
            }}
            className={`text-[11px] text-slate-200 drop-shadow cursor-pointer ${
              isDescExpanded ? 'line-clamp-none' : 'line-clamp-2'
            }`}
          >
            {reel.description}
            {!isDescExpanded && <span className="text-blue-300 font-semibold ml-1">...more</span>}
          </p>

          {/* Connected Assessment Tag */}
          <div className="pt-0.5 flex items-center gap-1.5 text-[10px] text-blue-200 font-medium">
            <Award size={11} className="text-blue-400 shrink-0" />
            <span className="truncate">1 Assessment Question Connected</span>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <CommentSheet
        reelId={reel.id}
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />

      <ShareModal
        reel={reel}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};
