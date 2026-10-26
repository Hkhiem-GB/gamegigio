import React, { useState, useMemo } from 'react';
import { Game, DisplayGame, isRealGame } from '../types/game';
import { GENRES, ALL_GENRE_ID } from '../data/genres';
import { GameCard } from './GameCard';
import { createPlaceholdersList } from '../utils/gameData';
import { CustomDropdown, DropdownOption } from './CustomDropdown';
import { Search, Sparkles, Library, RotateCcw, Layers, Filter, Eye } from 'lucide-react';

interface GameLibraryProps {
  allGames: Game[];
  genreCounts?: Record<string, number>;
  onOpenGameDetails: (game: Game) => void;
}

const DEFAULT_PAGE_SIZE = 20;

export const GameLibrary: React.FC<GameLibraryProps> = ({
  allGames,
  genreCounts,
  onOpenGameDetails,
}) => {
  // Independent filter state for Game Library
  const [selectedGenre, setSelectedGenre] = useState<string>(ALL_GENRE_ID);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number | 'all'>(DEFAULT_PAGE_SIZE);
  const [visibleCount, setVisibleCount] = useState<number>(DEFAULT_PAGE_SIZE);

  // Filter real games by genre (checking all genres the game belongs to), search query, and popularity tier
  const filteredRealGames = useMemo(() => {
    return allGames.filter((game) => {
      // 1. Genre filter: check if the game belongs to the chosen genre
      if (selectedGenre !== ALL_GENRE_ID) {
        const gameGenres = game.genres || (game.genre ? [game.genre] : []);
        if (!gameGenres.includes(selectedGenre)) {
          return false;
        }
      }

      // 2. Popularity tier filter
      if (selectedTier !== 'all' && game.popularity !== selectedTier) {
        return false;
      }

      // 3. Search query filter (matches official name, Vietnamese description, tags, App ID)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = game.name.toLowerCase().includes(query);
        const matchesNameVi = game.nameVi?.toLowerCase().includes(query);
        const matchesDescVi = game.descriptionVi?.toLowerCase().includes(query);
        const matchesShortDescVi = game.shortDescriptionVi?.toLowerCase().includes(query);
        const matchesId = game.id.toString().includes(query);
        const matchesGenre = game.genreName?.toLowerCase().includes(query);
        const matchesGenresVi = game.genresVi?.some((g) => g.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesNameVi &&
          !matchesDescVi &&
          !matchesShortDescVi &&
          !matchesId &&
          !matchesGenre &&
          !matchesGenresVi
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allGames, selectedGenre, selectedTier, searchQuery]);

  // Determine whether we have any real games matching
  const hasRealGames = filteredRealGames.length > 0;

  // Active genre display name
  const currentGenreName =
    selectedGenre === ALL_GENRE_ID
      ? 'Tất cả'
      : GENRES.find((g) => g.id === selectedGenre)?.vietnameseName || 'Game';

  // Display items: either visible sliced real games or skeleton cards to maintain layout
  const displayItems: DisplayGame[] = useMemo(() => {
    if (!hasRealGames) {
      const placeholderCount = typeof pageSize === 'number' ? pageSize : DEFAULT_PAGE_SIZE;
      return createPlaceholdersList(placeholderCount, currentGenreName);
    }
    const currentLimit = pageSize === 'all' ? filteredRealGames.length : visibleCount;
    return filteredRealGames.slice(0, currentLimit);
  }, [hasRealGames, filteredRealGames, visibleCount, pageSize, currentGenreName]);

  const handlePageSizeChange = (newVal: string) => {
    if (newVal === 'all') {
      setPageSize('all');
      setVisibleCount(filteredRealGames.length);
    } else {
      const size = parseInt(newVal, 10) || DEFAULT_PAGE_SIZE;
      setPageSize(size);
      setVisibleCount(size);
    }
  };

  const handleLoadMore = () => {
    const step = typeof pageSize === 'number' ? pageSize : DEFAULT_PAGE_SIZE;
    setVisibleCount((prev) => prev + step);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTier('all');
    setSelectedGenre(ALL_GENRE_ID);
    if (pageSize !== 'all') {
      setVisibleCount(pageSize);
    }
  };

  const handleCardClick = (displayGame: DisplayGame) => {
    if (isRealGame(displayGame)) {
      onOpenGameDetails(displayGame);
    }
  };

  // Dropdown Options: Genre
  const genreOptions: DropdownOption[] = useMemo(() => {
    const allOption: DropdownOption = {
      value: ALL_GENRE_ID,
      label: 'Tất cả thể loại',
      badge: allGames.length,
    };

    const genreList = GENRES.map((g) => {
      const count =
        genreCounts?.[g.id] ??
        allGames.filter((gm) => (gm.genres || [gm.genre]).includes(g.id)).length;
      return {
        value: g.id,
        label: g.vietnameseName,
        subLabel: g.name,
        badge: count,
      };
    });

    return [allOption, ...genreList];
  }, [allGames, genreCounts]);

  // Dropdown Options: Popularity Tier
  const tierOptions: DropdownOption[] = useMemo(
    () => [
      { value: 'all', label: 'Mọi độ phổ biến' },
      {
        value: 'gray',
        label: 'Ít phổ biến',
        subLabel: 'Bậc Xám — Thường gặp',
        indicatorColor: '#71717A',
      },
      {
        value: 'purple',
        label: 'Khá phổ biến',
        subLabel: 'Bậc Tím — Nổi bật',
        indicatorColor: '#A855F7',
      },
      {
        value: 'gold',
        label: 'Nổi tiếng',
        subLabel: 'Bậc Vàng — Huyền thoại',
        indicatorColor: '#F59E0B',
      },
      {
        value: 'red',
        label: 'Siêu nổi tiếng',
        subLabel: 'Bậc Đỏ — Đỉnh cao Steam',
        indicatorColor: '#E61C39',
      },
    ],
    []
  );

  // Dropdown Options: Page Size
  const pageSizeOptions: DropdownOption[] = useMemo(
    () => [
      { value: '20', label: '20 game / trang' },
      { value: '50', label: '50 game / trang' },
      { value: 'all', label: 'Xem tất cả game' },
    ],
    []
  );

  return (
    <section id="kho-game" className="relative w-full py-12 border-t border-[#3B2027]/70 overflow-hidden">
      {/* Animated crimson light sweep */}
      <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-20 h-[2px] w-1/3 animate-footer-light"
          style={{
            background:
                'linear-gradient(90deg, transparent, #FF4359, #FF8A98, #FF4359, transparent)',
            boxShadow: '0 0 8px 1px rgba(255, 67, 89, 0.65)',
          }}
      />
      {/* Layer 1: Base Seamless Obsidian & Deep Wine Red Gradient (scales infinitely) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#10090B] via-[#150A0E] to-[#10090B] pointer-events-none"
      />

      {/* Layer 2: Top Center Ambient Crimson Glow (Accentuates Kho Game title & filter controls) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] max-w-full h-[450px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(230, 28, 57, 0.12) 0%, rgba(156, 19, 40, 0.05) 50%, transparent 80%)',
        }}
      />

      {/* Layer 3: Flank Ambient Crimson Glows (Left & Right subtle vertical atmospheric haze) */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/4 w-80 sm:w-96 h-[850px] bg-gradient-to-r from-[#E61C39]/12 via-[#9C1328]/06 to-transparent blur-3xl pointer-events-none rounded-full"
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/3 w-80 sm:w-96 h-[850px] bg-gradient-to-l from-[#E61C39]/12 via-[#9C1328]/06 to-transparent blur-3xl pointer-events-none rounded-full"
      />

      {/* Layer 4: Subtle Cyber Tech Grid Pattern (Repeats smoothly across any infinite height) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(rgba(230, 28, 57, 0.25) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Layer 5: Top Seamless Bridge Gradient (softly fades from upper Roulette section) */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#10090B] via-[#10090B]/60 to-transparent pointer-events-none"
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4359] mb-2">
              <Library className="w-4 h-4 text-[#E61C39]" />
              <span>Thư viện trò chơi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F1EC] tracking-tight">
              Kho Game
            </h2>
            <p className="mt-1 text-sm text-[#A8A0A3]">
              Khám phá toàn bộ danh sách game theo thể loại và độ hiếm. Bộ lọc hoạt động độc lập với vòng quay.
            </p>
          </div>

          {/* Real Games Total Counter */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#211014] border border-[#3B2027] text-xs text-[#A8A0A3] self-start md:self-auto shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E61C39]" />
            <span>
              Tìm thấy: <strong className="text-white font-mono">{filteredRealGames.length}</strong> game
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-[#211014] border border-[#3B2027] shadow-lg mb-8 flex flex-col lg:flex-row items-center gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A0A3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (pageSize !== 'all') setVisibleCount(pageSize);
              }}
              placeholder="Tìm theo tên game hoặc App ID..."
              className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#10090B] border border-[#3B2027] focus:border-[#E61C39] focus:ring-1 focus:ring-[#E61C39] text-sm text-[#F5F1EC] placeholder-[#756D70] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#A8A0A3] hover:text-[#FF4359] cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Custom Genre Filter Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-56">
            <CustomDropdown
              label="Lọc theo thể loại"
              icon={<Layers className="w-4 h-4" />}
              options={genreOptions}
              value={selectedGenre}
              onChange={(val) => {
                setSelectedGenre(val);
                if (pageSize !== 'all') setVisibleCount(pageSize);
              }}
              menuWidthClass="w-full sm:w-64"
            />
          </div>

          {/* Custom Popularity Tier Filter Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-52">
            <CustomDropdown
              label="Lọc theo độ phổ biến"
              icon={<Filter className="w-4 h-4" />}
              options={tierOptions}
              value={selectedTier}
              onChange={(val) => {
                setSelectedTier(val);
                if (pageSize !== 'all') setVisibleCount(pageSize);
              }}
              menuWidthClass="w-full sm:w-60"
            />
          </div>

          {/* Custom Page Size Selector Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-44">
            <CustomDropdown
              label="Số lượng hiển thị"
              icon={<Eye className="w-4 h-4" />}
              options={pageSizeOptions}
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              menuWidthClass="w-full sm:w-48"
            />
          </div>

          {/* Reset button if filtered */}
          {(searchQuery || selectedGenre !== ALL_GENRE_ID || selectedTier !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full lg:w-auto px-4 py-2.5 rounded-xl bg-[#2C141B] hover:bg-[#3B2027] text-[#F5F1EC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#3B2027] hover:border-[#E61C39]/50 flex-shrink-0 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF4359]" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* Active Filter Badges */}
        {(selectedGenre !== ALL_GENRE_ID || selectedTier !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#756D70]">Bộ lọc đang chọn:</span>

            {selectedGenre !== ALL_GENRE_ID && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E61C39]/15 text-[#FF4359] border border-[#E61C39]/30">
                <span>Thể loại: {currentGenreName}</span>
                <button
                  type="button"
                  onClick={() => setSelectedGenre(ALL_GENRE_ID)}
                  className="hover:text-white font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}

            {selectedTier !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#211014] text-[#F5F1EC] border border-[#3B2027]">
                <span>
                  Bậc:{' '}
                  {tierOptions.find((t) => t.value === selectedTier)?.label || selectedTier}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTier('all')}
                  className="hover:text-[#FF4359] font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#211014] text-[#F5F1EC] border border-[#3B2027]">
                <span>Từ khóa: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-[#FF4359] font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((game, index) => (
            <GameCard
              key={'id' in game ? `game-${game.id}` : `placeholder-${game.key}-${index}`}
              game={game}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasRealGames && pageSize !== 'all' && visibleCount < filteredRealGames.length && (
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleLoadMore}
              className="px-8 py-3.5 rounded-xl bg-[#211014] hover:bg-[#2C141B] text-[#F5F1EC] hover:text-white border border-[#3B2027] hover:border-[#E61C39]/50 font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-red-glow cursor-pointer"
            >
              Xem thêm {Math.min(typeof pageSize === 'number' ? pageSize : DEFAULT_PAGE_SIZE, filteredRealGames.length - visibleCount)} game tiếp theo
            </button>
            <span className="text-xs text-[#756D70]">
              Đang hiển thị {Math.min(visibleCount, filteredRealGames.length)} / {filteredRealGames.length} game
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
