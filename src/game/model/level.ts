import type { MazeGrid } from "./maze";
import type { Position } from "./position";

export const BIOME_IDS = ["forest-trail"] as const;

export type BiomeId = (typeof BIOME_IDS)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export type CompletionRule =
  | {
      readonly type: "reach-exit";
    }
  | {
      readonly type: "collect-all-and-reach-exit";
    };

export type LevelConfig = {
  readonly seed: string;
  readonly width: number;
  readonly height: number;
  readonly biome: BiomeId;
  readonly difficulty: Difficulty;
  readonly collectibleDensity: number;
  readonly obstacleDensity: number;
  readonly loopChance: number;
  readonly completionRule: CompletionRule;
};

export type Collectible = {
  readonly id: string;
  readonly position: Position;
  readonly type: "cherry";
};

export type Obstacle = {
  readonly id: string;
  readonly position: Position;
  readonly type: "rock";
};

export type Decoration = {
  readonly id: string;
  readonly position: Position;
  readonly type: "leaf" | "grass" | "flower" | "stone";
};

export type LevelMetrics = {
  readonly shortestPathLength: number;
  readonly reachableCellCount: number;
  readonly deadEndCount: number;
  readonly junctionCount: number;
};

export type GeneratedLevel = {
  readonly seed: string;
  readonly name: string;
  readonly biome: BiomeId;
  readonly difficulty: Difficulty;
  readonly grid: MazeGrid;
  readonly start: Position;
  readonly exit: Position;
  readonly shortestPath: readonly Position[];
  readonly collectibles: readonly Collectible[];
  readonly obstacles: readonly Obstacle[];
  readonly decorations: readonly Decoration[];
  readonly metrics: LevelMetrics;
  readonly completionRule: CompletionRule;
};
