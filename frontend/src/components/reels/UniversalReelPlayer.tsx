import React, { useState, useEffect, useRef } from 'react';
import { Reel } from '../../types';
import { parseMediaSource } from '../../utils/mediaUtils';
import { Play, Pause } from 'lucide-react';

interface UniversalReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  isMuted?: boolean;
  onTimeProgress?: (progressPercent: number) => void;
  onAutoWatchComplete?: () => void;
  showHeartAnim?: boolean;
  showControls?: boolean;
  onTogglePlayPause?: (isPlaying: boolean) => void;
}

export const UniversalReelPlayer: React.FC<UniversalReelPlayerProps> = ({
  reel,
  isActive,
  isMuted = true,
  onTimeProgress,
  onAutoWatchComplete,
  showHeartAnim,
  showControls = false,
  onTogglePlayPause
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasTriggeredComplete, setHasTriggeredComplete] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const watchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mediaSource = parseMediaSource(reel.videoUrl, isMuted);

  // Reload iframe when mute or active status changes
  useEffect(() => {
    if (mediaSource.type === 'youtube') {
      setIframeKey(k => k + 1);
      setIsPlaying(true);
      onTogglePlayPause?.(true);
    }
  }, [isMuted, mediaSource.type, isActive]);

  // Reset completion trigger when reel changes
  useEffect(() => {
    setHasTriggeredComplete(false);
    setProgress(0);
    setIsPlaying(true);
    onTogglePlayPause?.(true);
  }, [reel.id]);

  // Handle direct HTML5 video playback (LMS Verified Masterclasses)
  useEffect(() => {
    if (mediaSource.type === 'direct' && videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              onTogglePlayPause?.(true);
            })
            .catch(() => {
              setIsPlaying(false);
              onTogglePlayPause?.(false);
            });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        onTogglePlayPause?.(false);
      }
    }
  }, [isActive, mediaSource.type]);

  // Handle progression timer for progress bar
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (isActive && isPlaying) {
      // Progress ticker for YouTube/Instagram embeds
      if (mediaSource.type !== 'direct') {
        let currentSec = 0;
        const totalDuration = reel.durationSeconds || 50;

        progressIntervalRef.current = setInterval(() => {
          currentSec += 0.5;
          const pct = Math.min(100, (currentSec / totalDuration) * 100);
          setProgress(pct);
          onTimeProgress?.(pct);
        }, 500);
      }
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isActive, isPlaying, reel.id, mediaSource.type]);

  // Direct video time update (LMS Verified)
  const handleDirectTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      const pct = (current / total) * 100;
      setProgress(pct);
      onTimeProgress?.(pct);
    }
  };

  // Toggle play/pause only on user click/touch
  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    onTogglePlayPause?.(nextPlaying);

    // Handle YouTube iframe pause/play command
    if (mediaSource.type === 'youtube' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextPlaying ? 'playVideo' : 'pauseVideo',
          args: []
        }),
        '*'
      );
    }

    // Handle Direct video pause/play
    if (mediaSource.type === 'direct' && videoRef.current) {
      if (nextPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none cursor-pointer"
      onClick={handleTogglePlayPause}
    >
      {/* Top Video Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Media Rendering */}
      {mediaSource.type === 'youtube' && mediaSource.id ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black pointer-events-none">
          {isActive ? (
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={`https://www.youtube-nocookie.com/embed/${mediaSource.id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${mediaSource.id}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`}
              title={reel.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0 object-cover"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={reel.thumbnailUrl || mediaSource.thumbnailUrl}
                alt={reel.title}
                className="w-full h-full object-cover opacity-60 filter blur-xs"
              />
            </div>
          )}
        </div>
      ) : mediaSource.type === 'instagram' && mediaSource.id ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black pointer-events-none">
          {isActive ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${reel.platformEmbedId || 'aircAruvnKk'}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${reel.platformEmbedId || 'aircAruvnKk'}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
              title={reel.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 object-cover"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}
        </div>
      ) : (
        /* Direct MP4 / HTML5 Video (LMS Verified Masterclass) */
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none bg-black">
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleDirectTimeUpdate}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Floating Gradient Backdrop for bottom text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none z-10" />

      {/* Center Play/Pause Indicator (ONLY visible when user clicks or video is paused) */}
      {(!isPlaying || showControls) && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-25 transition-opacity duration-300 ${
            !isPlaying || showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-2xl">
            {isPlaying ? (
              <Pause size={28} className="text-white fill-white" />
            ) : (
              <Play size={28} className="text-white fill-white translate-x-0.5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
