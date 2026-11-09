import type { Difficulty, LevelConfig } from "../model";

const BASE_LEVEL_CONFIG = {
  biome: "forest-trail",
  completionRule: {
    type: "collect-all-and-reach-exit",
  },
} as const satisfies Partial<LevelConfig>;

export const LEVEL_PRESETS = {
  easy: {
    ...BASE_LEVEL_CONFIG,
    seed: "forest-trail-easy",
    width: 9,
    height: 7,
    difficulty: "easy",
    collectibleDensity: 0.08,
    obstacleDensity: 0.04,
    loopChance: 0.05,
  },
  medium: {
    ...BASE_LEVEL_CONFIG,
    seed: "forest-trail-medium",
    width: 13,
    height: 9,
    difficulty: "medium",
    collectibleDensity: 0.1,
    obstacleDensity: 0.08,
    loopChance: 0.1,
  },
  hard: {
    ...BASE_LEVEL_CONFIG,
    seed: "forest-trail-hard",
    width: 17,
    height: 11,
    difficulty: "hard",
    collectibleDensity: 0.12,
    obstacleDensity: 0.12,
    loopChance: 0.15,
  },
} as const satisfies Record<Difficulty, LevelConfig>;

export function createLevelConfig(difficulty: Difficulty, seed: string): LevelConfig {
  return {
    ...LEVEL_PRESETS[difficulty],
    seed,
  };
}
