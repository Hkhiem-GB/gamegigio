import { describe, it, expect } from 'vitest';
import { getAllUniqueGames, getGamesByGenre, getCandidateGames } from '../utils/gameData';
import { GENRES, ALL_GENRE_ID } from '../data/genres';

describe('Kho Game & Independent Filter Tests', () => {
  const allUnique = getAllUniqueGames();

  it('All configured genres have 50 games each', () => {
    expect(GENRES).toHaveLength(12);

    for (const genre of GENRES) {
      const gamesInGenre = getGamesByGenre(genre.id);
      expect(gamesInGenre).toHaveLength(50);
    }
  });

  it('Every horror game in allUniqueGames contains "horror" in its genres', () => {
    const horrorGames = allUnique.filter((g) => (g.genres || [g.genre]).includes('horror'));
    expect(horrorGames).toHaveLength(50);

    // Verify notable horror titles
    const names = horrorGames.map((g) => g.name);
    expect(names).toContain('Resident Evil 4');
    expect(names).toContain('SILENT HILL 2');
    expect(names).toContain('Dead Space');
    expect(names).toContain('Phasmophobia');
  });

  it('Every FMV game in allUniqueGames contains "fmv" in its genres', () => {
    const fmvGames = allUnique.filter((g) => (g.genres || [g.genre]).includes('fmv'));
    expect(fmvGames).toHaveLength(50);

    // Verify notable FMV titles
    const names = fmvGames.map((g) => g.name);
    expect(names).toContain('Her Story');
    expect(names).toContain('IMMORTALITY');
    expect(names).toContain('Not For Broadcast');
    expect(names).toContain('Late Shift');
  });

  it('Candidate games for roulette wheel filter independently by genre without altering allUniqueGames', () => {
    const allCandidates = getCandidateGames(ALL_GENRE_ID);
    expect(allCandidates.length).toBe(allUnique.length);

    const horrorCandidates = getCandidateGames('horror');
    expect(horrorCandidates).toHaveLength(50);

    const fmvCandidates = getCandidateGames('fmv');
    expect(fmvCandidates).toHaveLength(50);

    // Verify allUnique remains untouched
    expect(allUnique.length).toBe(399);
  });
});
