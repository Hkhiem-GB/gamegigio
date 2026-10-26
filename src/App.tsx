import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Roulette } from './components/Roulette';
import { GenreSelector } from './components/GenreSelector';
import { GameLibrary } from './components/GameLibrary';
import { Footer } from './components/Footer';
import { GameResultModal } from './components/GameResultModal';
import { WelcomeModal } from './components/WelcomeModal';

import { Game } from './types/game';
import { GENRES, ALL_GENRE_ID, getGenreShortName } from './data/genres';
import { getAllUniqueGames, getCandidateGames, getGamesByGenre } from './utils/gameData';

export const App: React.FC = () => {
  // 1. Independent Roulette Filter State
  const [rouletteGenre, setRouletteGenre] = useState<string>(ALL_GENRE_ID);

  // Modal state
  const [activeModalGame, setActiveModalGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRouletteResult, setIsRouletteResult] = useState<boolean>(false);

  // Welcome modal state (khi user truy cập web hoặc F5 web)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(true);

  // All unique real games in system
  const allUniqueGames = useMemo(() => getAllUniqueGames(), []);

  // Candidate real games for the active roulette genre (only depends on rouletteGenre!)
  const candidateGames = useMemo(() => {
    return getCandidateGames(rouletteGenre);
  }, [rouletteGenre]);

  // Compute counts of real games per genre for chips
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {
      [ALL_GENRE_ID]: allUniqueGames.length,
    };
    for (const genre of GENRES) {
      counts[genre.id] = getGamesByGenre(genre.id).length;
    }
    return counts;
  }, [allUniqueGames]);

  // Active genre display name for roulette
  const selectedRouletteGenreName = getGenreShortName(rouletteGenre);

  // Handlers
  const handleSpinComplete = (winner: Game) => {
    setActiveModalGame(winner);
    setIsRouletteResult(true);
    setIsModalOpen(true);
  };

  const handleOpenGameDetails = (game: Game) => {
    setActiveModalGame(game);
    setIsRouletteResult(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#10090B] text-[#F5F3F4] selection:bg-[#E61C39] selection:text-white">
      {/* 1. Header with Sound Toggle */}
      <Header totalGamesCount={allUniqueGames.length} />

      {/* 2. Main Section */}
      <main className="relative flex-1 w-full overflow-hidden">
        {/* 2.1 Hero & Roulette Section with Dark Gaming Cinematic Background */}
        <section className="relative w-full overflow-hidden">
          {/* Layer 1: Base Deep Burgundy Obsidian Gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#10090B] via-[#140A0D] to-[#10090B] pointer-events-none"
          />

          {/* Layer 2: Cinematic Digital Concept Art Wallpaper (Extends seamlessly through entire section) */}
          <div
            aria-hidden="true"
            className="gaming-hero-wallpaper absolute inset-0 pointer-events-none opacity-85 sm:opacity-90 contrast-[1.1] brightness-[0.95]"
          />

          {/* Layer 3: Red Neon Atmosphere & Ambient Glow Flanks */}
          {/* Left Flank Ambient Crimson Glow */}
          <div
            aria-hidden="true"
            className="absolute -left-48 top-16 w-96 sm:w-[500px] h-[600px] bg-gradient-to-r from-[#E61C39]/20 via-[#9C1328]/10 to-transparent blur-3xl pointer-events-none rounded-full"
          />
          {/* Right Flank Ambient Crimson Glow */}
          <div
            aria-hidden="true"
            className="absolute -right-48 top-32 w-96 sm:w-[500px] h-[600px] bg-gradient-to-l from-[#E61C39]/20 via-[#9C1328]/10 to-transparent blur-3xl pointer-events-none rounded-full"
          />
          {/* Upper Hero Soft Red Accent (Behind title & roulette) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 top-36 w-[800px] max-w-full h-[450px] bg-[#9C1328]/15 blur-[120px] pointer-events-none rounded-full"
          />

          {/* Layer 4: Subtle Cyber Tech Grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-20 sm:opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(230, 28, 57, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(230, 28, 57, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 85%)',
            }}
          />

          {/* Layer 5: Soft Center Readability Scrim & Seamless Blends */}
          {/* Top Blend Gradient (fades seamlessly into Header bottom border) */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#10090B] via-[#10090B]/50 to-transparent pointer-events-none"
          />
          {/* Center Readability Scrim (darkens the center under text & roulette while keeping city flanks 100% visible) */}
          <div
            aria-hidden="true"
            className="gaming-hero-scrim absolute inset-0 pointer-events-none"
          />

          {/* Main Interactive Content Container */}
          <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10 sm:pb-12 flex flex-col gap-8 sm:gap-10">
            {/* Hero Title & Intro */}
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center relative">
              {/* Subtle Ambient Red Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-36 bg-[#E61C39]/12 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-center">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-brand font-black tracking-[-0.02em] text-[#F5F1EC] uppercase drop-shadow-sm select-none">
                  GAME GÌ GIỜ<span className="text-[#E61C39] drop-shadow-[0_0_16px_rgba(230,28,57,0.55)] ml-[0.03em]">?</span>
                </h1>
              </div>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#A8A0A3] leading-relaxed">
                Hàng ngàn tựa game trên Steam nhưng bạn không biết nên bấm nút tải game nào?
                Chọn thể loại yêu thích và nhấn <strong className="text-[#F5F1EC]">QUAY NGAY</strong> để vòng quay chọn giúp bạn tựa game lý tưởng!
              </p>
            </div>

            {/* Genre Selector (Chỉ dành riêng cho Vòng quay) */}
            <div className="max-w-5xl mx-auto w-full">
              <GenreSelector
                selectedGenre={rouletteGenre}
                onSelectGenre={setRouletteGenre}
                genreCounts={genreCounts}
              />
            </div>

            {/* Roulette Horizontal Wheel */}
            <div className="w-full">
              <Roulette
                candidateGames={candidateGames}
                selectedGenreName={selectedRouletteGenreName}
                onSpinComplete={handleSpinComplete}
              />
            </div>
          </div>
        </section>

        {/* 2.2 Game Library (Kho game: bộ lọc hoàn toàn độc lập với vòng quay, background riêng biệt) */}
        <GameLibrary
          allGames={allUniqueGames}
          genreCounts={genreCounts}
          onOpenGameDetails={handleOpenGameDetails}
        />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 3. Modal Kết Quả (Game Result Modal with Reveal Sound) */}
      <GameResultModal
        game={activeModalGame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isRouletteResult={isRouletteResult}
      />

      {/* 4. Modal Chào Mừng (Welcome Modal hiển thị khi truy cập hoặc F5 web) */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
      />
    </div>
  );
};

export default App;
