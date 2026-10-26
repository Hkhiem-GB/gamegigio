import React from 'react';
import { GENRES, ALL_GENRE_ID } from '../data/genres';
import { Layers } from 'lucide-react';

interface GenreSelectorProps {
  selectedGenre: string;
  onSelectGenre: (genreId: string) => void;
  genreCounts?: Record<string, number>;
  disabled?: boolean;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenre,
  onSelectGenre,
  genreCounts = {},
  disabled = false,
}) => {
  const allCount = genreCounts[ALL_GENRE_ID] ?? 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <label className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#A8A0A3] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#E52E45]" />
          Chọn thể loại game:
        </label>
      </div>

      {/* Horizontal scrollable or flex-wrap chips container */}
      <div className="flex flex-wrap items-center gap-2 py-1">
        {/* "Tất cả" option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectGenre(ALL_GENRE_ID)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border select-none ${
            selectedGenre === ALL_GENRE_ID
              ? 'bg-[#E52E45] text-white border-[#FF4359] shadow-md shadow-[#E52E45]/40 font-semibold'
              : 'bg-[#211014] text-[#A8A0A3] hover:text-[#F5F3F4] hover:bg-[#2C141B] border-[#3B2027] hover:border-[#5C2833]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
        >
          <span>Tất cả</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedGenre === ALL_GENRE_ID
                ? 'bg-black/30 text-white'
                : 'bg-black/40 text-[#A8A0A3]'
            }`}
          >
            {allCount}
          </span>
        </button>

        {/* 10 Genres */}
        {GENRES.map((genre) => {
          const isSelected = selectedGenre === genre.id;
          const count = genreCounts[genre.id] ?? 0;

          return (
            <button
              key={genre.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectGenre(genre.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border select-none ${
                isSelected
                  ? 'bg-[#E52E45] text-white border-[#FF4359] shadow-md shadow-[#E52E45]/40 font-semibold'
                  : 'bg-[#211014] text-[#A8A0A3] hover:text-[#F5F3F4] hover:bg-[#2C141B] border-[#3B2027] hover:border-[#5C2833]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            >
              <span>{genre.vietnameseName}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected
                    ? 'bg-black/30 text-white'
                    : 'bg-black/40 text-[#A8A0A3]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
