/**
 * Media parsing and embedding utility for educational Reels,
 * supporting YouTube Shorts, Instagram Reels, and direct video sources.
 */

export interface ParsedMediaSource {
  type: 'youtube' | 'instagram' | 'direct';
  id?: string;
  embedUrl: string;
  originalUrl: string;
  thumbnailUrl?: string;
  platformName: string;
}

/**
 * Extract YouTube Video or Shorts ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Pattern: youtube.com/shorts/ID
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{8,})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1].split('?')[0];

  // Pattern: youtu.be/ID
  const youtuMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{8,})/i);
  if (youtuMatch && youtuMatch[1]) return youtuMatch[1].split('?')[0];

  // Pattern: youtube.com/watch?v=ID
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{8,})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Pattern: youtube.com/embed/ID
  const embedMatch = cleanUrl.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{8,})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1].split('?')[0];

  // If already an 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

/**
 * Extract Instagram Reel or Post ID from URL
 */
export function extractInstagramId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Pattern: instagram.com/reel/ID/ or instagram.com/p/ID/
  const match = cleanUrl.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Auto-detect and parse any media URL into structured embed data
 */
export function parseMediaSource(url: string, isMuted: boolean = true): ParsedMediaSource {
  if (!url) {
    return {
      type: 'direct',
      embedUrl: '',
      originalUrl: '',
      platformName: 'Direct Video'
    };
  }

  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      type: 'youtube',
      id: ytId,
      // YouTube embed with autoplay, loop, playsinline, and mute parameter
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`,
      originalUrl: `https://www.youtube.com/shorts/${ytId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      platformName: 'YouTube Shorts'
    };
  }

  const igId = extractInstagramId(url);
  if (igId) {
    return {
      type: 'instagram',
      id: igId,
      embedUrl: `https://www.instagram.com/reel/${igId}/embed/`,
      originalUrl: `https://www.instagram.com/reel/${igId}/`,
      platformName: 'Instagram Reel'
    };
  }

  return {
    type: 'direct',
    embedUrl: url,
    originalUrl: url,
    platformName: 'LMS Masterclass'
  };
}
