import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Game, isRealGame, POPULARITY_TIER_CONFIG, GameMovie, GameScreenshot } from '../types/game';
import { soundManager } from '../utils/audio';
import { SteamVideoPlayer } from './SteamVideoPlayer';
import {
  ExternalLink,
  HelpCircle,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  X,
} from 'lucide-react';

interface GameResultModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  isRouletteResult?: boolean;
}

type MediaItem =
  | { kind: 'movie'; movie: GameMovie; key: string }
  | { kind: 'screenshot'; screenshot: GameScreenshot; key: string }
  | { kind: 'header'; url: string; key: string };

export const GameResultModal: React.FC<GameResultModalProps> = ({
  game,
  isOpen,
  onClose,
  isRouletteResult = false,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [siteMuted, setSiteMuted] = useState<boolean>(soundManager.getMuted());
  const [imageError, setImageError] = useState<boolean>(false);
  const hasPlayedRevealSound = useRef<boolean>(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Subscribe to global sound mute toggle
  useEffect(() => {
    return soundManager.subscribe((muted) => setSiteMuted(muted));
  }, []);

  // Build unified media items list from Steam metadata or fallbacks
  const mediaItems: MediaItem[] = useMemo(() => {
    if (!game || !isRealGame(game)) return [];

    const items: MediaItem[] = [];
    const media = game.media;

    // 1. Trailers first (like Steam store page)
    if (media && media.movies && media.movies.length > 0) {
      for (const m of media.movies) {
        if (m.hlsUrl || m.mp4Url || m.webmUrl) {
          items.push({ kind: 'movie', movie: m, key: `m-${m.id}` });
        }
      }
    }

    // 2. Screenshots
    if (media && media.screenshots && media.screenshots.length > 0) {
      for (const s of media.screenshots) {
        items.push({ kind: 'screenshot', screenshot: s, key: `s-${s.id}` });
      }
    }

    // 3. Fallback to header theme image if no screenshots/movies
    if (items.length === 0 && game.theme && game.theme !== 'placeholder') {
      items.push({ kind: 'header', url: game.theme, key: `h-${game.id}` });
    }

    return items;
  }, [game]);

  // Reset states whenever game changes or modal opens
  useEffect(() => {
    if (isOpen && game) {
      setActiveIndex(0);
      setImageError(false);
    }
  }, [isOpen, game]);

  // Preload adjacent media so navigating gallery is instantaneous
  useEffect(() => {
    if (!isOpen || mediaItems.length === 0) return;
    const nextIdx = (activeIndex + 1) % mediaItems.length;
    const prevIdx = (activeIndex - 1 + mediaItems.length) % mediaItems.length;

    [nextIdx, prevIdx].forEach((idx) => {
      const it = mediaItems[idx];
      if (it.kind === 'screenshot') {
        const img = new Image();
        img.src = it.screenshot.full;
      } else if (it.kind === 'movie') {
        const img = new Image();
        img.src = it.movie.thumbnail;
      }
    });
  }, [isOpen, activeIndex, mediaItems]);

  // Play reveal sound when opened via roulette spin
  useEffect(() => {
    if (isOpen && game && isRouletteResult && !hasPlayedRevealSound.current) {
      soundManager.playModalReveal(game.popularity);
      hasPlayedRevealSound.current = true;
    }

    if (!isOpen) {
      hasPlayedRevealSound.current = false;
    }
  }, [isOpen, game, isRouletteResult]);

  // Close on Escape key & Lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (mediaItems.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, mediaItems.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = thumbnailStripRef.current;
    if (!strip) return;
    const activeThumb = strip.children[activeIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  // If not open or not a real game, do not render
  if (!isOpen || !game || !isRealGame(game)) {
    return null;
  }

  const tierConfig = POPULARITY_TIER_CONFIG[game.popularity] ?? POPULARITY_TIER_CONFIG.gray;
  const isRedTier = game.popularity === 'red';
  const activeMedia = mediaItems[activeIndex] ?? null;

  const handlePrevMedia = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  };

  const handleNextMedia = () => {
    setActiveIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  };

  // Safe fallback if active trailer fails to load: switch to next available screenshot
  const handleTrailerError = () => {
    console.warn('[GameResultModal] Trailer playback failed, switching to screenshot.');
    const firstScreenshotIdx = mediaItems.findIndex((it) => it.kind === 'screenshot');
    if (firstScreenshotIdx !== -1) {
      setActiveIndex(firstScreenshotIdx);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Backdrop with dark-red ambient tint */}
      <div
        className="fixed inset-0 bg-[#10090B]/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container: Steam Showcase Card */}
      <div
        className={`relative w-full max-w-4xl lg:max-w-5xl bg-[#190B0F] border rounded-2xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden z-10 my-4 sm:my-8 flex flex-col max-h-[92vh] transform transition-all duration-300 animate-in fade-in zoom-in-95 ${
          isRedTier ? 'border-[#FF4359]/70 shadow-red-glow-lg' : 'border-[#3B2027]'
        }`}
      >
        {/* Top Tier Strip */}
        <div
          className="h-1.5 w-full flex-shrink-0"
          style={{
            backgroundColor: tierConfig.color,
            boxShadow: `0 0 16px ${tierConfig.glowColor}`,
          }}
        />

        {/* Top Close Button ('X') */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-[#E61C39] text-[#A8A0A3] hover:text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-lg active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 flex flex-col p-4 sm:p-6 gap-6">
          {/* Main Media Showcase (16:9 Cinema View) */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-[#3B2027] shadow-xl shadow-black/80 flex items-center justify-center">
              {/* 1. Video Player Mode */}
              {activeMedia && activeMedia.kind === 'movie' ? (
                <SteamVideoPlayer
                  key={activeMedia.key}
                  movie={activeMedia.movie}
                  isSiteMuted={siteMuted}
                  onPlaybackError={handleTrailerError}
                />
              ) : activeMedia && activeMedia.kind === 'screenshot' ? (
                /* 2. Gameplay Screenshot Mode */
                <img
                  src={activeMedia.screenshot.full}
                  alt={`${game.name} Screenshot`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain bg-black"
                />
              ) : !imageError && game.theme && game.theme !== 'placeholder' ? (
                /* 3. Header Image Fallback */
                <img
                  src={game.theme}
                  alt={game.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* 4. Safe Placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#211014] to-[#10090B] text-[#A8A0A3]">
                  <HelpCircle className="w-16 h-16 text-[#756D70]" strokeWidth={1.5} />
                  <span className="mt-2 text-xs font-mono">Không có ảnh xem trước</span>
                </div>
              )}

              {/* Prev / Next Chevrons on Main Media (if more than 1 item) */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMedia}
                    aria-label="Xem media trước đó"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#10090B]/80 hover:bg-[#E52E45] text-white backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMedia}
                    aria-label="Xem media tiếp theo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#10090B]/80 hover:bg-[#E52E45] text-white backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transition-all active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Media Counter Pill */}
                  <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-[#F5F3F4] border border-white/10 flex items-center gap-1.5 pointer-events-none">
                    {activeMedia?.kind === 'movie' ? (
                      <Film className="w-3 h-3 text-[#FF4359]" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-[#A8A0A3]" />
                    )}
                    <span>
                      {activeIndex + 1} / {mediaItems.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Carousel (Steam-Style Media Strip) */}
            {mediaItems.length > 1 && (
              <div
                ref={thumbnailStripRef}
                className="w-full flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar select-none"
              >
                {mediaItems.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  const thumbUrl =
                    item.kind === 'movie'
                      ? item.movie.thumbnail
                      : item.kind === 'screenshot'
                      ? item.screenshot.thumbnail
                      : item.url;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Chọn media ${idx + 1}`}
                      className={`relative flex-shrink-0 w-24 sm:w-28 h-14 sm:h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#FF4359] shadow-red-glow ring-2 ring-[#FF4359] scale-105 z-10'
                          : 'border-[#3B2027] opacity-65 hover:opacity-100 hover:border-[#5C2833]'
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />

                      {/* Video Indicator Badge on Thumbnail */}
                      {item.kind === 'movie' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-[#E52E45]/90 flex items-center justify-center shadow-sm">
                            <Film className="w-3 h-3 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Game Information Section */}
          <div className="flex flex-col gap-4 bg-[#211014] p-5 sm:p-6 rounded-2xl border border-[#3B2027]">
            <div>
              <h2
                id="game-modal-title"
                className="font-brand font-extrabold text-2xl sm:text-3xl tracking-wide uppercase text-white drop-shadow-sm"
              >
                {game.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Vietnamese Genre Tags */}
                {game.genresVi && game.genresVi.length > 0 ? (
                  game.genresVi.slice(0, 4).map((gVi) => (
                    <span
                      key={gVi}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#10090B] text-[#F5F3F4] border border-[#3B2027] flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#E52E45]" />
                      <span>{gVi}</span>
                    </span>
                  ))
                ) : game.genreName ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#10090B] text-[#F5F3F4] border border-[#3B2027] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E52E45]" />
                    <span>{game.genreName}</span>
                  </span>
                ) : null}

                {/* Popularity Badge */}
                <span
                  className="px-2.5 py-1 rounded-md  text-xs font-semibold flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'rgba(25, 11, 15, 0.95)',
                    color: tierConfig.color,
                    borderColor: tierConfig.borderColor,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tierConfig.color }} />
                  <span>{tierConfig.label}</span>
                </span>

                <span className="text-xs text-[#A8A0A3] ml-1">
                   {tierConfig.description}
                </span>
              </div>
            </div>

            {/* Vietnamese Game Description */}
            {(game.descriptionVi || game.media?.descriptionVi || game.media?.description) ? (
              <div className="text-sm sm:text-base text-[#F5F3F4]/95 leading-relaxed bg-[#10090B]/60 p-4 rounded-xl border border-[#3B2027]/70 font-normal">
                {game.descriptionVi || game.media?.descriptionVi || game.media?.description}
              </div>
            ) : (
              <div className="text-sm text-[#756D70] italic">
                Tựa game chính thức trên nền tảng Steam. Xem chi tiết thông số, đánh giá cộng đồng và đặt mua trực tiếp tại trang cửa hàng.
              </div>
            )}

            {/* Steam Verified Assurance */}
            <div className="pt-3 border-t border-[#3B2027]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A8A0A3]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#90EE90]" />
                <span>Trang cửa hàng Steam chính thức đã được xác thực</span>
              </div>
              <span className="font-mono text-[#756D70]">App ID: {game.id}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <a
              href={game.steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#E52E45] to-[#8F172B] hover:from-[#FF4359] hover:to-[#E52E45] text-white font-extrabold text-sm shadow-xl shadow-[#E52E45]/30 hover:shadow-red-glow border border-[#FF4359]/70 flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
            >
              <span>XEM TRÊN STEAM</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
