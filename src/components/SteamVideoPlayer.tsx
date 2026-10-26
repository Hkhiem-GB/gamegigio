import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { GameMovie } from '../types/game';
import { Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle } from 'lucide-react';

interface SteamVideoPlayerProps {
  movie: GameMovie;
  isSiteMuted: boolean;
  onPlaybackError?: () => void;
  className?: string;
}

export const SteamVideoPlayer: React.FC<SteamVideoPlayerProps> = ({
  movie,
  isSiteMuted,
  onPlaybackError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Default muted to prevent loud surprise audio
  const [hasError, setHasError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<any>(null);

  // Sync mute state if site is muted
  useEffect(() => {
    if (isSiteMuted) {
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  }, [isSiteMuted]);

  // Handle video source loading & HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setProgress(0);
    setIsPlaying(false);

    // Destroy previous HLS instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const videoSource = movie.hlsUrl || movie.mp4Url || movie.webmUrl;
    if (!videoSource) {
      setHasError(true);
      onPlaybackError?.();
      return;
    }

    // Set video attributes for safe autoplay & mobile compatibility
    video.muted = isMuted;
    video.playsInline = true;

    const tryAutoPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy; user can click to play
            setIsPlaying(false);
          });
      }
    };

    if (movie.hlsUrl) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari/iOS)
        video.src = movie.hlsUrl;
        video.addEventListener('loadeddata', tryAutoPlay, { once: true });
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false, // VOD trailer optimization: prevents fragment buffer stalls
          autoStartLoad: true,
          capLevelToPlayerSize: true, // Cap stream resolution to container (drastically faster initial load)
          startLevel: 1, // Start on fast 720p/480p stream for instant playback (<300ms)
          startFragPrefetch: true, // Concurrently prefetch first fragment while parsing playlist
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          maxBufferSize: 25 * 1000 * 1000,
          progressive: true,
          fragLoadingTimeOut: 8000,
          manifestLoadingTimeOut: 8000,
        });

        hls.loadSource(movie.hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          tryAutoPlay();
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.warn('[SteamVideoPlayer] HLS fatal error:', data.type);
            if (movie.mp4Url) {
              video.src = movie.mp4Url;
              video.addEventListener('loadeddata', tryAutoPlay, { once: true });
            } else {
              setHasError(true);
              onPlaybackError?.();
            }
          }
        });
        hlsRef.current = hls;
      } else if (movie.mp4Url) {
        video.src = movie.mp4Url;
        video.addEventListener('loadeddata', tryAutoPlay, { once: true });
      } else {
        setHasError(true);
        onPlaybackError?.();
      }
    } else if (movie.mp4Url || movie.webmUrl) {
      video.src = (movie.mp4Url || movie.webmUrl)!;
      video.addEventListener('loadeddata', tryAutoPlay, { once: true });
    }

    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [movie, onPlaybackError]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    const dur = video.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    if (dur > 0) {
      setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = newPercent * duration;
    setProgress(newPercent * 100);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-[#10090B] text-[#A8A0A3] p-4 text-center ${className}`}>
        <AlertCircle className="w-10 h-10 text-[#FF4359] mb-2" />
        <p className="text-sm font-semibold text-[#F5F3F4]">Không thể phát trailer</p>
        <p className="text-xs text-[#756D70] mt-1">Đang chuyển sang ảnh chụp màn hình gameplay...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none group ${className}`}
    >
      <video
        ref={videoRef}
        poster={movie.thumbnail}
        preload="auto"
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          onPlaybackError?.();
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Button Overlay when paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Phát trailer"
          className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E52E45]/90 hover:bg-[#FF4359] text-white flex items-center justify-center shadow-red-glow-lg transition-transform hover:scale-110 active:scale-95 border-2 border-white/20"
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
        </button>
      )}

      {/* Bottom Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 transition-opacity duration-300 flex flex-col gap-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Progress Bar */}
        <div
          onClick={handleSeek}
          className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative transition-all"
        >
          <div
            className="h-full bg-[#FF4359] rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transform scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Tạm dừng" : "Phát"}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Bật âm thanh trailer" : "Tắt âm thanh trailer"}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center gap-1.5"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#FF4359]" />
                  <span className="text-[10px] text-[#A8A0A3] hidden sm:inline">Tắt tiếng</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#90EE90]" />
                  <span className="text-[10px] text-[#90EE90] hidden sm:inline">Bật tiếng</span>
                </>
              )}
            </button>

            {/* Time Indicator */}
            {duration > 0 && (
              <span className="text-[11px] font-mono text-[#A8A0A3]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#A8A0A3] font-medium hidden sm:inline truncate max-w-[200px]">
              {movie.name}
            </span>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Toàn màn hình"
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
