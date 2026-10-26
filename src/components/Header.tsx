import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  totalGamesCount: number;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    return soundManager.subscribe((muted) => setIsMuted(muted));
  }, []);

  const handleToggleSound = () => {
    soundManager.toggleMute();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3B2027] bg-[#10090B]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E61C39] rounded-lg p-1"
        >
          <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-xl border border-none flex items-center justify-center p-1.5 group-hover:border-[#E61C39]/60 shadow-md group-hover:shadow-[0_0_20px_rgba(230,28,57,0.35)] transition-all duration-300">
            <img
              src="/game-gi-gio-logo.svg"
              alt="Game Gì Giờ? Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(230,28,57,0.35)]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-brand font-black text-lg sm:text-xl md:text-2xl tracking-[-0.02em] text-[#F5F1EC] group-hover:text-white transition-colors uppercase leading-none select-none drop-shadow-sm">
                GAME GÌ GIỜ<span className="text-[#E61C39] drop-shadow-[0_0_12px_rgba(230,28,57,0.55)] ml-[0.02em]">?</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#A8A0A3] font-medium mt-0.5">
              Vòng quay chọn game ngẫu nhiên
            </p>
          </div>
        </a>

        {/* Header Right Action / Stats / Sound Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            title={isMuted ? "Bật âm thanh hiệu ứng" : "Tắt âm thanh hiệu ứng"}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isMuted
                ? 'bg-[#190B0F] text-[#A8A0A3] border-[#3B2027] hover:text-white hover:border-[#5C2833]'
                : 'bg-[#211014] text-[#FF4359] border-[#E52E45]/40 shadow-[0_0_12px_rgba(229,46,69,0.2)] hover:border-[#FF4359]'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-zinc-400" />
                <span className="hidden sm:inline">Tắt tiếng</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#FF4359]" />
                <span className="hidden sm:inline">Âm thanh</span>
              </>
            )}
          </button>

          {/* Real Games Counter Pill */}
          <a
            href="#kho-game"
            className="text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-[#211014] hover:bg-[#2C141B] text-[#F5F3F4] border border-[#3B2027] hover:border-[#E52E45]/40 transition-all shadow-sm"
          >
            Kho Game
          </a>
        </div>
      </div>
    </header>
  );
};
