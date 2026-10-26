import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Game, DisplayGame, POPULARITY_TIER_CONFIG } from '../types/game';
import { GameCard } from './GameCard';
import { pickWeightedRandomGame } from '../utils/weightedRandom';
import { createPlaceholdersList } from '../utils/gameData';
import { soundManager } from '../utils/audio';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';

interface RouletteProps {
  candidateGames: Game[];
  selectedGenreName: string;
  onSpinComplete: (winningGame: Game) => void;
}

const TOTAL_CARDS_IN_SPIN = 70;
const WINNER_INDEX = 55; // Destination index in the animation strip
const SPIN_DURATION_MS = 5500; // 5.5 seconds exciting gaming roulette spin

// Quartic ease-out curve: fast energetic start, long smooth deceleration
function rouletteEasing(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export const Roulette: React.FC<RouletteProps> = ({
  candidateGames,
  selectedGenreName,
  onSpinComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinStrip, setSpinStrip] = useState<DisplayGame[]>([]);
  const [winningGame, setWinningGame] = useState<Game | null>(null);
  const [hasLanded, setHasLanded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Persistent refs to track exact position and prevent unwanted reset
  const currentOffsetRef = useRef<number>(0);
  const landedIndexRef = useRef<number | null>(null);
  const lastGenreRef = useRef<string>('');

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const hasRealGames = candidateGames.length > 0;

  /**
   * Calculates card dimensions based on container width & viewport
   */
  const getCardMetrics = useCallback(() => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    let cardWidth = 240;
    let gap = 16;

    if (windowWidth < 640) {
      cardWidth = 200;
      gap = 12;
    } else if (windowWidth < 768) {
      cardWidth = 220;
      gap = 16;
    } else {
      cardWidth = 240;
      gap = 16;
    }

    return { cardWidth, gap, step: cardWidth + gap };
  }, []);

  // Update track position during window resize if already landed, keeping winning card centered
  useEffect(() => {
    const handleResize = () => {
      if (isSpinning || !hasLanded || landedIndexRef.current === null) return;
      if (!containerRef.current || !trackRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const { cardWidth, step } = getCardMetrics();
      const targetCenter = landedIndexRef.current * step + cardWidth / 2;
      const destination = -(targetCenter - containerWidth / 2);

      currentOffsetRef.current = destination;
      trackRef.current.style.transform = `translate3d(${destination}px, 0, 0)`;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSpinning, hasLanded, getCardMetrics]);

  // Build the track ONLY when the genre actually changes or on initial mount
  // Crucial: Does NOT run or reset when isSpinning turns false or modal opens/closes!
  useEffect(() => {
    // If the genre hasn't changed, we already have cards rendered, do not reset!
    if (lastGenreRef.current === selectedGenreName && spinStrip.length > 0) {
      return;
    }
    lastGenreRef.current = selectedGenreName;

    // Reset state for newly selected genre
    setHasLanded(false);
    setWinningGame(null);
    landedIndexRef.current = null;
    currentOffsetRef.current = 0;

    if (trackRef.current) {
      trackRef.current.style.transform = 'translate3d(0px, 0, 0)';
    }

    if (!hasRealGames) {
      const placeholders = createPlaceholdersList(15, selectedGenreName);
      setSpinStrip(placeholders);
    } else {
      const idleList: Game[] = [];
      while (idleList.length < 24) {
        for (const g of candidateGames) {
          idleList.push(g);
          if (idleList.length >= 24) break;
        }
      }
      setSpinStrip(idleList);
    }
  }, [candidateGames, hasRealGames, selectedGenreName]); // Notice: isSpinning is intentionally omitted!

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /**
   * Gaming Roulette Spin Logic
   */
  const handleSpin = () => {
    if (isSpinning || !hasRealGames) return;

    // 1. Pick winner beforehand using weighted random logic
    const selectedWinner = pickWeightedRandomGame(candidateGames);
    if (!selectedWinner) return;

    setWinningGame(selectedWinner);
    setIsSpinning(true);
    setHasLanded(false);
    landedIndexRef.current = null;

    // Play startup sound
    soundManager.playSpinStart();

    // 2. Build the spin strip containing 70 real game cards with winner at WINNER_INDEX
    const newStrip: Game[] = [];
    for (let i = 0; i < TOTAL_CARDS_IN_SPIN; i++) {
      if (i === WINNER_INDEX) {
        newStrip.push(selectedWinner);
      } else {
        const randomFiller = candidateGames[Math.floor(Math.random() * candidateGames.length)];
        newStrip.push(randomFiller);
      }
    }
    setSpinStrip(newStrip);

    // 3. Reset track position to 0 for start of animation
    currentOffsetRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = 'translate3d(0px, 0, 0)';
    }

    // 4. Calculate exact destination
    requestAnimationFrame(() => {
      if (!containerRef.current || !trackRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const { cardWidth, step } = getCardMetrics();

      // Target position: winning card centered under the marker
      const targetCenter = WINNER_INDEX * step + cardWidth / 2;
      const destination = -(targetCenter - containerWidth / 2);

      const duration = isReducedMotion ? 300 : SPIN_DURATION_MS;
      const startTime = performance.now();
      let lastCardCrossedIndex = -1;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easedProgress = isReducedMotion ? progress : rouletteEasing(progress);
        const currentOffset = easedProgress * destination;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${currentOffset}px, 0, 0)`;
        }

        // Detect card crossings across the center line to trigger ticks
        const currentTrackShift = Math.abs(currentOffset);
        const centerLineAbs = currentTrackShift + containerWidth / 2;
        const currentCardIndex = Math.floor(centerLineAbs / step);

        if (currentCardIndex !== lastCardCrossedIndex && currentCardIndex >= 0 && currentCardIndex <= TOTAL_CARDS_IN_SPIN) {
          lastCardCrossedIndex = currentCardIndex;
          const velocity = Math.max(0.05, Math.pow(1 - progress, 3));
          soundManager.playTick(velocity);
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Animation finished! Commit final position permanently
          currentOffsetRef.current = destination;
          landedIndexRef.current = WINNER_INDEX;

          if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${destination}px, 0, 0)`;
          }

          setIsSpinning(false);
          setHasLanded(true);

          // Play winning lock-in sound
          soundManager.playWin(selectedWinner.popularity);

          // Wait 650ms for visual satisfaction and sound to register, then open modal
          const modalTimer = setTimeout(() => {
            onSpinComplete(selectedWinner);
          }, 650);

          return () => clearTimeout(modalTimer);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Popularity Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2.5 px-4 mb-4 rounded-xl bg-[#211014]/80 border border-[#3B2027] backdrop-blur-sm text-xs">
        <span className="text-[#A8A0A3] font-medium uppercase tracking-wider text-[11px]">
          Mức độ phổ biến & Tỉ lệ:
        </span>
        {(['gray', 'purple', 'gold', 'red'] as const).map((tierKey) => {
          const config = POPULARITY_TIER_CONFIG[tierKey];
          return (
            <div key={tierKey} className="flex items-center gap-1.5" title={config.description}>
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: config.color,
                  boxShadow: `0 0 6px ${config.color}`,
                }}
              />
              <span className="text-[#F5F3F4] font-medium">{config.label}</span>
              <span className="text-[#756D70] font-mono text-[11px]">
                (w: {config.weight})
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Roulette Box */}
      <div
        className={`relative w-full rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#211014] via-[#190B0F] to-[#10090B] border transition-all duration-500 shadow-2xl shadow-black/80 overflow-hidden ${
          hasLanded
            ? 'border-[#FF4359] shadow-red-glow-lg'
            : isSpinning
            ? 'border-[#E52E45]/60 shadow-red-glow'
            : 'border-[#3B2027]'
        }`}
      >
        {/* Glow ambient background effect */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 blur-3xl pointer-events-none rounded-full transition-all duration-700 ${
            hasLanded
              ? 'bg-[#E52E45]/35 opacity-100 scale-125'
              : isSpinning
              ? 'bg-[#E52E45]/20 opacity-80'
              : 'bg-[#8F172B]/15 opacity-40'
          }`}
        />

        {/* Center Target Indicator (Vạch chọn laser cố định ở chính giữa) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center justify-between">
          {/* Top Pointer Arrow */}
          <div className="flex flex-col items-center animate-laser">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-[#FF4359] filter drop-shadow-[0_0_10px_rgba(255,67,89,1)]" />
            <div className="w-2.5 h-2.5 bg-[#FF4359] rounded-full -mt-1 shadow-pointer" />
          </div>

          {/* Vertical center laser line */}
          <div className="w-[2px] h-full bg-gradient-to-b from-[#FF4359] via-[#E52E45] to-[#FF4359] opacity-95 shadow-pointer" />

          {/* Bottom Pointer Arrow */}
          <div className="flex flex-col items-center animate-laser">
            <div className="w-2.5 h-2.5 bg-[#FF4359] rounded-full -mb-1 shadow-pointer" />
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-[#FF4359] filter drop-shadow-[0_0_10px_rgba(255,67,89,1)]" />
          </div>
        </div>

        {/* Left & Right Soft Darkness Gradients (Fade-out) */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#10090B] via-[#10090B]/85 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#10090B] via-[#10090B]/85 to-transparent z-20 pointer-events-none" />

        {/* Carousel Window */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-4 sm:py-5 min-h-[220px] sm:min-h-[240px] flex items-center"
        >
          {/* Sliding Cards Track */}
          <div
            ref={trackRef}
            className="flex items-center gap-3 sm:gap-4 will-change-transform"
            style={{ transform: 'translate3d(0px, 0, 0)' }}
          >
            {spinStrip.map((item, index) => {
              const cardKey = 'kind' in item ? `${item.key}-${index}` : `${item.id}-${index}`;
              const isWinnerCard = hasLanded && winningGame && 'id' in item && item.id === winningGame.id;

              return (
                <GameCard
                  key={cardKey}
                  game={item}
                  variant="roulette"
                  isHighlighted={Boolean(isWinnerCard)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Spin Controls & Information */}
      <div className="mt-6 flex flex-col items-center">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning || !hasRealGames}
          aria-label={hasRealGames ? "Quay ngay" : "Chưa có game để quay"}
          className={`relative group px-8 sm:px-14 py-3.5 sm:py-4 rounded-2xl font-extrabold text-base sm:text-lg tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 select-none ${
            isSpinning
              ? 'bg-[#211014] text-[#A8A0A3] border border-[#3B2027] cursor-wait shadow-none'
              : !hasRealGames
              ? 'bg-[#190B0F] text-[#756D70] border border-[#3B2027]/50 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-[#E52E45] to-[#8F172B] hover:from-[#FF4359] hover:to-[#E52E45] text-white hover:text-white shadow-xl shadow-[#E52E45]/35 hover:shadow-red-glow-lg border border-[#FF4359]/70 active:scale-95 cursor-pointer'
          }`}
        >
          {/* Glowing pulse on hover */}
          {hasRealGames && !isSpinning && (
            <div className="absolute inset-0 rounded-2xl bg-[#E52E45] blur-md opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none" />
          )}

          {isSpinning ? (
            <>
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-[#FF4359]" />
              <span>ĐANG QUAY...</span>
            </>
          ) : !hasRealGames ? (
            <>
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#756D70]" />
              <span>Chưa có game để quay</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" />
              <span className="text-white">QUAY NGAY</span>
            </>
          )}
        </button>

        {/* Status subtext */}
        <p className="mt-2 text-xs text-[#FF4359] text-center font-medium min-h-[18px]">
          {isSpinning && (
            <span className="animate-pulse">
              Vòng quay đang tìm ra tựa game dành cho bạn...
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
