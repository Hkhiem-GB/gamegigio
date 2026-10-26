import { Game, isRealGame, PopularityTier } from '../types/game';

export const POPULARITY_WEIGHTS: Record<PopularityTier, number> = {
  gray: 1.0,
  purple: 0.65,
  gold: 0.3,
  red: 0.12,
};

/**
 * Gets the weight of a game based on its popularity tier.
 */
export function getGameWeight(game: Game): number {
  return POPULARITY_WEIGHTS[game.popularity] ?? 1.0;
}

/**
 * Selects a winning game from a list of real games using weighted random selection.
 * Higher popularity games have lower probability of being picked.
 * Strictly excludes placeholders and invalid game entries.
 */
export function pickWeightedRandomGame(games: readonly Game[]): Game | null {
  // Filter out any potential invalid or placeholder entries
  const validGames = games.filter(isRealGame);
  if (validGames.length === 0) {
    return null;
  }

  if (validGames.length === 1) {
    return validGames[0];
  }

  // Calculate total weight
  const totalWeight = validGames.reduce((sum, game) => sum + getGameWeight(game), 0);
  if (totalWeight <= 0) {
    return validGames[Math.floor(Math.random() * validGames.length)];
  }

  // Generate random float in [0, totalWeight)
  const randomVal = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const game of validGames) {
    cumulativeWeight += getGameWeight(game);
    if (randomVal <= cumulativeWeight) {
      return game;
    }
  }

  // Fallback to last valid game in case of float rounding edge cases
  return validGames[validGames.length - 1];
}

/**
 * Computes the relative probability percentage for each popularity tier in a given set of games.
 */
export function calculateTierProbabilities(games: readonly Game[]): Record<PopularityTier, number> {
  const validGames = games.filter(isRealGame);
  const result: Record<PopularityTier, number> = {
    gray: 0,
    purple: 0,
    gold: 0,
    red: 0,
  };

  if (validGames.length === 0) return result;

  const totalWeight = validGames.reduce((sum, game) => sum + getGameWeight(game), 0);
  if (totalWeight <= 0) return result;

  const weightsPerTier: Record<PopularityTier, number> = {
    gray: 0,
    purple: 0,
    gold: 0,
    red: 0,
  };

  for (const game of validGames) {
    weightsPerTier[game.popularity] += getGameWeight(game);
  }

  for (const tier of Object.keys(weightsPerTier) as PopularityTier[]) {
    result[tier] = (weightsPerTier[tier] / totalWeight) * 100;
  }

  return result;
}
