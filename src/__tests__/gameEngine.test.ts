import { describe, it, expect } from 'vitest';
import { isRealGame, Game, PopularityTier } from '../types/game';
import { pickWeightedRandomGame } from '../utils/weightedRandom';
import {
  getAllUniqueGames,
  getGamesByGenre,
  getCandidateGames,
  createPlaceholder,
  createPlaceholdersList,
  isExcludedGame,
} from '../utils/gameData';
import { GENRES, ALL_GENRE_ID } from '../data/genres';
import { soundManager } from '../utils/audio';

describe('Game Data & Integrity', () => {
  it('should have 12 configured genres', () => {
    expect(GENRES).toHaveLength(12);
    const genreIds = GENRES.map((g) => g.id);
    expect(genreIds).toEqual([
      'action',
      'adventure',
      'rpg',
      'strategy',
      'simulation',
      'casual',
      'indie',
      'sports',
      'racing',
      'mmo',
      'horror',
      'fmv',
    ]);
  });

  it('should load games from each genre with valid Steam properties', () => {
    const validTiers: PopularityTier[] = ['gray', 'purple', 'gold', 'red'];

    for (const genre of GENRES) {
      const games = getGamesByGenre(genre.id);
      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBeGreaterThanOrEqual(15); // Expanded catalog requirement

      for (const game of games) {
        expect(isRealGame(game)).toBe(true);
        expect(game.id).toBeGreaterThan(0);
        expect(typeof game.name).toBe('string');
        expect(game.name.trim().length).toBeGreaterThan(0);
        expect(game.theme).toMatch(/^https?:\/\//);
        expect(game.steamUrl).toMatch(/^https:\/\/store\.steampowered\.com\/app\/\d+\//);
        expect(validTiers).toContain(game.popularity);
      }
    }
  });

  it('should deduplicate games across genres in getAllUniqueGames', () => {
    const allUnique = getAllUniqueGames();
    expect(allUnique.length).toBeGreaterThan(0);

    const ids = allUnique.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should return correct candidates for "all" and specific genres', () => {
    const allCandidates = getCandidateGames(ALL_GENRE_ID);
    const uniqueAll = getAllUniqueGames();
    expect(allCandidates.length).toBe(uniqueAll.length);

    const actionCandidates = getCandidateGames('action');
    expect(actionCandidates.length).toBeGreaterThan(0);
    for (const game of actionCandidates) {
      expect(game.genre).toBe('action');
    }
  });

  it('should contain verified MixiGaming highlights', () => {
    const allGames = getAllUniqueGames();
    const gameIds = allGames.map((g) => g.id);

    // Verify key titles from MixiGaming highlights
    expect(gameIds).toContain(3097560); // Liar's Bar
    expect(gameIds).toContain(2567870); // Chained Together
    expect(gameIds).toContain(1568590); // Goose Goose Duck
    expect(gameIds).toContain(1040210); // Crime Scene Cleaner
    expect(gameIds).toContain(376210);  // The Isle
    expect(gameIds).toContain(1782210); // Crab Game
    expect(gameIds).toContain(2881650); // Content Warning
  });
});

describe('Strict Exclusion Rules (PUBG Ban)', () => {
  it('should identify and block PUBG by App ID and name variations', () => {
    expect(isExcludedGame(578080, 'PUBG: BATTLEGROUNDS')).toBe(true);
    expect(isExcludedGame(578080, 'Custom Name')).toBe(true);
    expect(isExcludedGame(999999, 'PUBG Mobile')).toBe(true);
    expect(isExcludedGame(888888, 'PlayerUnknown\'s Battlegrounds')).toBe(true);
  });

  it('should allow legitimate non-banned games', () => {
    expect(isExcludedGame(730, 'Counter-Strike 2')).toBe(false);
    expect(isExcludedGame(570, 'Dota 2')).toBe(false);
    expect(isExcludedGame(1245620, 'ELDEN RING')).toBe(false);
  });

  it('should NEVER contain PUBG in any genre JSON or aggregate game list', () => {
    const allGames = getAllUniqueGames();
    for (const game of allGames) {
      expect(game.id).not.toBe(578080);
      expect(isExcludedGame(game.id, game.name)).toBe(false);
      expect(game.name.toLowerCase()).not.toContain('pubg');
    }

    for (const genre of GENRES) {
      const genreGames = getGamesByGenre(genre.id);
      for (const game of genreGames) {
        expect(game.id).not.toBe(578080);
        expect(isExcludedGame(game.id, game.name)).toBe(false);
      }
    }
  });
});

describe('Skeleton Data & Type Guard', () => {
  it('should accurately distinguish between real Game and GamePlaceholder', () => {
    const realGame: Game = {
      id: 730,
      name: 'Counter-Strike 2',
      theme: 'https://cdn.example.com/730.jpg',
      steamUrl: 'https://store.steampowered.com/app/730/',
      popularity: 'red',
    };

    const placeholder = createPlaceholder('test-key', 'Hành động');

    expect(isRealGame(realGame)).toBe(true);
    expect(isRealGame(placeholder)).toBe(false);
    expect(isRealGame(null)).toBe(false);
    expect(isRealGame(undefined)).toBe(false);
    expect(isRealGame({} as any)).toBe(false);
  });

  it('should construct placeholders with strict required properties', () => {
    const placeholder = createPlaceholder('key-1', 'Phiêu lưu');
    expect(placeholder.kind).toBe('placeholder');
    expect(placeholder.name).toBe('No Name');
    expect(placeholder.theme).toBe('placeholder');
    expect(placeholder.popularity).toBe('gray');
    expect(placeholder.genreName).toBe('Phiêu lưu');
  });

  it('should generate requested count of placeholder cards', () => {
    const list = createPlaceholdersList(8, 'RPG');
    expect(list).toHaveLength(8);
    for (const item of list) {
      expect(item.name).toBe('No Name');
      expect(item.popularity).toBe('gray');
      expect(isRealGame(item)).toBe(false);
    }
  });
});

describe('Weighted Random Selection', () => {
  it('should return null when given an empty candidate list', () => {
    const result = pickWeightedRandomGame([]);
    expect(result).toBeNull();
  });

  it('should return the sole game when only one candidate exists', () => {
    const singleGame: Game = {
      id: 570,
      name: 'Dota 2',
      theme: 'https://cdn.example.com/570.jpg',
      steamUrl: 'https://store.steampowered.com/app/570/',
      popularity: 'red',
    };

    const winner = pickWeightedRandomGame([singleGame]);
    expect(winner).toEqual(singleGame);
  });

  it('should never select a placeholder even if one is passed', () => {
    const realGame: Game = {
      id: 620,
      name: 'Portal 2',
      theme: 'https://cdn.example.com/620.jpg',
      steamUrl: 'https://store.steampowered.com/app/620/',
      popularity: 'gold',
    };

    const placeholder = createPlaceholder('p1', 'Action');
    const listWithPlaceholder = [realGame, placeholder as any];

    for (let i = 0; i < 50; i++) {
      const picked = pickWeightedRandomGame(listWithPlaceholder);
      expect(picked).not.toBeNull();
      expect(isRealGame(picked)).toBe(true);
      expect(picked?.id).toBe(620);
    }
  });

  it('should respect weighted probabilities: Gray games should be picked substantially more often than Red games', () => {
    const grayGame: Game = {
      id: 101,
      name: 'Indie Hidden Gem',
      theme: 'https://cdn.example.com/101.jpg',
      steamUrl: 'https://store.steampowered.com/app/101/',
      popularity: 'gray', // weight: 1.00
    };

    const redGame: Game = {
      id: 102,
      name: 'Mega AAA Blockbuster',
      theme: 'https://cdn.example.com/102.jpg',
      steamUrl: 'https://store.steampowered.com/app/102/',
      popularity: 'red', // weight: 0.12
    };

    let grayCount = 0;
    let redCount = 0;
    const TOTAL_SIMULATIONS = 10000;

    for (let i = 0; i < TOTAL_SIMULATIONS; i++) {
      const winner = pickWeightedRandomGame([grayGame, redGame]);
      if (winner?.id === 101) grayCount++;
      if (winner?.id === 102) redCount++;
    }

    const grayRatio = grayCount / TOTAL_SIMULATIONS;
    const redRatio = redCount / TOTAL_SIMULATIONS;

    expect(grayRatio).toBeGreaterThan(0.80);
    expect(grayRatio).toBeLessThan(0.96);
    expect(redRatio).toBeGreaterThan(0.04);
    expect(redRatio).toBeLessThan(0.20);
    expect(grayCount).toBeGreaterThan(redCount * 4);
  });
});

describe('Sound Effect Manager (Web Audio API)', () => {
  it('should allow toggling and querying mute state', () => {
    const initial = soundManager.getMuted();
    soundManager.toggleMute();
    expect(soundManager.getMuted()).toBe(!initial);
    soundManager.setMuted(initial);
    expect(soundManager.getMuted()).toBe(initial);
  });

  it('should safely execute sound methods without crashing in non-browser environments', () => {
    expect(() => soundManager.playSpinStart()).not.toThrow();
    expect(() => soundManager.playTick(0.5)).not.toThrow();
    expect(() => soundManager.playWin('gold')).not.toThrow();
    expect(() => soundManager.playWin('red')).not.toThrow();
    expect(() => soundManager.playModalReveal('purple')).not.toThrow();
  });
});
