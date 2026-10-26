import { describe, it, expect } from 'vitest';
import { getAllUniqueGames, getGamesByGenre } from '../utils/gameData';
import { GENRES } from '../data/genres';
import gameTranslationsVi from '../data/gameTranslationsVi.json';

describe('Vietnamese Game Data Localization Integrity', () => {
  const allGames = getAllUniqueGames();

  it('Verifies exactly 399 unique games are loaded with zero duplicates', () => {
    expect(allGames.length).toBe(399);
    const idSet = new Set(allGames.map((g) => g.id));
    expect(idSet.size).toBe(399);
  });

  it('Verifies all 399 games have dedicated, non-empty Vietnamese descriptions', () => {
    for (const game of allGames) {
      expect(game.descriptionVi).toBeDefined();
      expect(typeof game.descriptionVi).toBe('string');
      expect(game.descriptionVi!.trim().length).toBeGreaterThanOrEqual(20);

      expect(game.shortDescriptionVi).toBeDefined();
      expect(typeof game.shortDescriptionVi).toBe('string');
      expect(game.shortDescriptionVi!.trim().length).toBeGreaterThanOrEqual(10);
    }
  });

  it('Verifies all 399 games have Vietnamese genre tags (genresVi)', () => {
    for (const game of allGames) {
      expect(game.genresVi).toBeDefined();
      expect(Array.isArray(game.genresVi)).toBe(true);
      expect(game.genresVi!.length).toBeGreaterThan(0);
    }
  });

  it('Verifies official Steam titles are preserved without artificial translations', () => {
    const knownOfficialTitles = [
      'Counter-Strike 2',
      'Dota 2',
      'ELDEN RING',
      'Cyberpunk 2077',
      'Grand Theft Auto V',
      'Black Myth: Wukong',
      'Baldur\'s Gate 3',
      'SILENT HILL 2',
      'Resident Evil 7 Biohazard',
      'Left 4 Dead 2',
      'Destiny 2',
      'Her Story'
    ];

    for (const title of knownOfficialTitles) {
      const found = allGames.find((g) => g.name === title);
      expect(found, `Expected to find official game ${title}`).toBeDefined();
    }
  });

  it('Verifies all 12 genre categories have exactly 50 localized games each', () => {
    for (const genre of GENRES) {
      const gamesInGenre = getGamesByGenre(genre.id);
      expect(gamesInGenre.length).toBe(50);
      for (const g of gamesInGenre) {
        expect(g.descriptionVi).toBeTruthy();
        expect(g.shortDescriptionVi).toBeTruthy();
      }
    }
  });

  it('Verifies translations map file contains all 399 entries', () => {
    const translationKeys = Object.keys(gameTranslationsVi);
    expect(translationKeys.length).toBe(399);
  });
});
