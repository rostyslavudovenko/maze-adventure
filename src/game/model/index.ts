export { DIRECTIONS } from "./direction";
export type { Direction } from "./direction";

export { getOppositeDirection, hasWall, OPPOSITE_DIRECTIONS } from "./directionUtils";

export { GAME_STATUSES } from "./gameState";
export type { GameStatus } from "./gameState";

export { BIOME_IDS, DIFFICULTIES } from "./level";
export type {
  BiomeId,
  Collectible,
  CompletionRule,
  Decoration,
  Difficulty,
  GeneratedLevel,
  LevelConfig,
  LevelMetrics,
  Obstacle,
} from "./level";

export type { Cell, CellWalls, MazeGrid } from "./maze";

export type { Position } from "./position";

export {
  arePositionsEqual,
  getManhattanDistance,
  getPositionKey,
  isPositionWithinBounds,
  movePosition,
} from "./positionUtils";
