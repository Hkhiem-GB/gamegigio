import actionData from '../data/action.json';
import adventureData from '../data/adventure.json';
import rpgData from '../data/rpg.json';
import strategyData from '../data/strategy.json';
import simulationData from '../data/simulation.json';
import casualData from '../data/casual.json';
import indieData from '../data/indie.json';
import sportsData from '../data/sports.json';
import racingData from '../data/racing.json';
import mmoData from '../data/mmo.json';
import horrorData from '../data/horror.json';
import fmvData from '../data/fmv.json';
import excludedGamesData from '../data/excludedGames.json';
import gameMediaData from '../data/gameMedia.json';
import gameTranslationsViData from '../data/gameTranslationsVi.json';

import { Game, GamePlaceholder, isRealGame, GameMedia } from '../types/game';
import { GENRES, ALL_GENRE_ID } from '../data/genres';

const MEDIA_MAP: Record<string, GameMedia> = gameMediaData as any;
const TRANSLATIONS_MAP: Record<
  string,
  {
    id: number;
    name: string;
    nameVi?: string;
    descriptionVi: string;
    shortDescriptionVi: string;
    genresVi: string[];
  }
> = gameTranslationsViData as any;

/**
 * Retrieves cached Steam media (screenshots, trailers, description) for an app ID.
 */
export function getGameMedia(appId: number): GameMedia | undefined {
  return MEDIA_MAP[appId.toString()];
}

/**
 * Checks if a game is in the forbidden/excluded list (e.g. PUBG).
 */
export function isExcludedGame(id: number, name: string): boolean {
  if (excludedGamesData.excludedAppIds.includes(id)) {
    return true;
  }
  const lowerName = name.toLowerCase();
  for (const pattern of excludedGamesData.excludedPatterns) {
    if (lowerName.includes(pattern.toLowerCase())) {
      return true;
    }
  }
  return false;
}

// Raw data dictionary mapping genre id to json array
const RAW_DATA_MAP: Record<string, unknown[]> = {
  action: actionData,
  adventure: adventureData,
  rpg: rpgData,
  strategy: strategyData,
  simulation: simulationData,
  casual: casualData,
  indie: indieData,
  sports: sportsData,
  racing: racingData,
  mmo: mmoData,
  horror: horrorData,
  fmv: fmvData,
};

/**
 * Validates and transforms a raw object into a Game object if valid.
 */
function sanitizeGame(raw: unknown, genreId: string, genreName: string): Game | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;

  if (typeof item.id !== 'number' || item.id <= 0) return null;
  if (typeof item.name !== 'string' || !item.name.trim()) return null;
  if (typeof item.theme !== 'string' || !item.theme.trim()) return null;
  if (typeof item.steamUrl !== 'string' || !item.steamUrl.trim()) return null;

  // Strict check against banned/excluded games (e.g. PUBG)
  if (isExcludedGame(item.id, item.name)) {
    return null;
  }

  const validPopularities = ['gray', 'purple', 'gold', 'red'] as const;
  const popularity = validPopularities.includes(item.popularity as any)
    ? (item.popularity as Game['popularity'])
    : 'gray';

  const trans = TRANSLATIONS_MAP[item.id.toString()];

  return {
    id: item.id,
    name: item.name.trim(),
    nameVi: trans?.nameVi,
    descriptionVi: trans?.descriptionVi,
    shortDescriptionVi: trans?.shortDescriptionVi,
    genresVi: trans?.genresVi,
    theme: item.theme.trim(),
    steamUrl: item.steamUrl.trim(),
    popularity,
    genre: genreId,
    genreName,
    media: getGameMedia(item.id),
  };
}

/**
 * Retrieves valid real games for a specific genre ID.
 */
export function getGamesByGenre(genreId: string): Game[] {
  const genreDef = GENRES.find((g) => g.id === genreId);
  const genreName = genreDef ? genreDef.vietnameseName : 'Game';

  const rawList = RAW_DATA_MAP[genreId];
  if (!Array.isArray(rawList)) return [];

  const list: Game[] = [];
  for (const item of rawList) {
    const game = sanitizeGame(item, genreId, genreName);
    if (game && isRealGame(game)) {
      list.push(game);
    }
  }
  return list;
}

/**
 * Retrieves all unique real games across all configured genres, deduplicated by Steam App ID.
 * Accumulates all genres a game belongs to into `genres: string[]`.
 */
export function getAllUniqueGames(): Game[] {
  const map = new Map<number, Game & { genres: string[] }>();

  for (const genre of GENRES) {
    const games = getGamesByGenre(genre.id);
    for (const game of games) {
      if (!isExcludedGame(game.id, game.name)) {
        if (!map.has(game.id)) {
          map.set(game.id, {
            ...game,
            genre: genre.id,
            genreName: game.genreName || genre.vietnameseName,
            genres: [genre.id],
          });
        } else {
          const existing = map.get(game.id)!;
          if (!existing.genres.includes(genre.id)) {
            existing.genres.push(genre.id);
          }
        }
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Retrieves the candidate real games for a given genre filter ('all' or specific genreId).
 */
export function getCandidateGames(genreId: string): Game[] {
  if (genreId === ALL_GENRE_ID) {
    return getAllUniqueGames();
  }
  return getGamesByGenre(genreId);
}

/**
 * Creates a compliant GamePlaceholder object.
 */
export function createPlaceholder(key: string, genreName?: string): GamePlaceholder {
  return {
    kind: 'placeholder',
    key,
    name: 'No Name',
    theme: 'placeholder',
    popularity: 'gray',
    genreName: genreName || 'Thể loại',
  };
}

/**
 * Generates an array of placeholder cards for layout preservation.
 */
export function createPlaceholdersList(count: number, genreName?: string): GamePlaceholder[] {
  return Array.from({ length: count }, (_, index) =>
    createPlaceholder(`placeholder-${genreName ?? 'default'}-${index}`, genreName)
  );
}
