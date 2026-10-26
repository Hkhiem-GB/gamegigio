import React, { useState } from 'react';
import { Game, DisplayGame, isRealGame, POPULARITY_TIER_CONFIG } from '../types/game';
import { HelpCircle, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: DisplayGame;
  variant?: 'roulette' | 'library';
  isHighlighted?: boolean;
  onClick?: (game: DisplayGame) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  variant = 'library',
  isHighlighted = false,
  onClick,
}) => {
  const isReal = isRealGame(game);
  const [imageError, setImageError] = useState(false);

  const tierConfig = POPULARITY_TIER_CONFIG[game.popularity] ?? POPULARITY_TIER_CONFIG.gray;

  // Custom question mark placeholder design
  const renderPlaceholderGraphic = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#211014] via-[#190B0F] to-[#10090B] overflow-hidden select-none">
      {/* Decorative background grid and ambient red glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E52E45]/[0.08] via-transparent to-black/60 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#8F172B]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#E52E45]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Center glowing question mark */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#2C141B] border border-[#3B2027] flex items-center justify-center shadow-inner group-hover:border-[#E52E45]/40 transition-colors">
          <HelpCircle className="w-8 h-8 md:w-9 md:h-9 text-[#A8A0A3] group-hover:text-[#FF4359] transition-colors" strokeWidth={1.75} />
        </div>
        <span className="mt-2 text-[11px] font-semibold tracking-widest text-[#A8A0A3] uppercase">
          {game.genreName ?? 'Slot'}
        </span>
      </div>
    </div>
  );

  const isRoulette = variant === 'roulette';

  return (
    <div
      onClick={() => {
        if (isReal && onClick) {
          onClick(game);
        }
      }}
      className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 ${
        isRoulette
          ? 'w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0 select-none'
          : 'w-full'
      } ${
        isReal
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl'
          : 'cursor-default opacity-85'
      } ${
        isHighlighted
          ? 'ring-2 ring-[#FF4359] shadow-red-glow-lg scale-105 z-20'
          : 'border border-[#3B2027] hover:border-[#5C2833]'
      } bg-[#211014] shadow-lg shadow-black/60`}
      style={{
        borderColor: isHighlighted
          ? '#FF4359'
          : isReal
          ? undefined
          : 'rgba(59, 32, 39, 0.7)',
      }}
    >
      {/* Popularity accent strip at top */}
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: tierConfig.color,
          boxShadow: isReal ? `0 0 12px ${tierConfig.glowColor}` : 'none',
        }}
      />

      {/* Image Thumbnail Container */}
      <div className={`relative w-full ${isRoulette ? 'h-[110px] sm:h-[120px]' : 'h-[140px] sm:h-[160px]'} bg-[#10090B] overflow-hidden`}>
        {isReal && !imageError && game.theme !== 'placeholder' ? (
          <>
            <img
              src={game.theme}
              alt={game.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211014] via-transparent to-black/30 pointer-events-none" />
          </>
        ) : (
          renderPlaceholderGraphic()
        )}

        {/* Popularity Tier Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide backdrop-blur-md border border-white/10 shadow-sm"
          style={{
            backgroundColor: 'rgba(25, 11, 15, 0.88)',
            color: tierConfig.color,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: tierConfig.color,
              boxShadow: `0 0 6px ${tierConfig.color}`,
            }}
          />
          {tierConfig.label}
        </div>

        {/* Genre Tag on image */}
        {(game.genreName || (isReal && (game as Game).genresVi?.[0])) && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#10090B]/85 text-[#F5F3F4] backdrop-blur-sm border border-white/10">
            {game.genreName || (game as Game).genresVi?.[0]}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`flex flex-col justify-between flex-1 ${isRoulette ? 'p-3' : 'p-3.5 sm:p-4'}`}>
        <div>
          <h3
            className={`font-bold line-clamp-1 text-[#F5F3F4] group-hover:text-white transition-colors ${
              isRoulette ? 'text-sm' : 'text-sm sm:text-base'
            }`}
            title={game.name}
          >
            {game.name}
          </h3>
          <p className={`mt-1 text-xs text-[#A8A0A3] ${isRoulette ? 'line-clamp-1' : 'line-clamp-2'} flex items-start gap-1`}>
            {isReal ? (
              <span className="leading-snug">
                {(game as Game).shortDescriptionVi || (game as Game).descriptionVi || tierConfig.description}
              </span>
            ) : (
              <span className="text-[#756D70] italic">Dữ liệu khung</span>
            )}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-3 pt-2.5 border-t border-[#3B2027]/70 flex items-center justify-between text-xs">
          {isReal ? (
            <>
              <span className="text-[#A8A0A3] text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E52E45]" />
                Steam Store
              </span>
            </>
          ) : (
            <span className="text-[#756D70] text-[11px] italic tracking-wider">
              Khung chờ dữ liệu
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
