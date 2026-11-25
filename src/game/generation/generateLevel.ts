import { DIRECTIONS, hasWall } from "../model";
import type { GeneratedLevel, LevelConfig, LevelMetrics, MazeGrid } from "../model";
import { createRandomSource } from "../random";
import { findShortestPath } from "./findShortestPath";
import { generateMaze } from "./generateMaze";
import { selectStartAndExit } from "./selectStartAndExit";

function calculateMetrics(grid: MazeGrid, shortestPathLength: number): LevelMetrics {
  let reachableCellCount = 0;
  let deadEndCount = 0;
  let junctionCount = 0;

  for (const row of grid) {
    for (const cell of row) {
      // generateMaze connects every cell to the rest of the grid.
      reachableCellCount += 1;

      const passageCount = DIRECTIONS.filter((direction) => !hasWall(cell.walls, direction)).length;

      if (passageCount === 1) {
        deadEndCount += 1;
      } else if (passageCount >= 3) {
        junctionCount += 1;
      }
    }
  }

  return {
    shortestPathLength,
    reachableCellCount,
    deadEndCount,
    junctionCount,
  };
}

export function generateLevel(config: LevelConfig): GeneratedLevel {
  const randomSource = createRandomSource(config.seed);
  const grid = generateMaze(config.width, config.height, randomSource);
  const { start, exit } = selectStartAndExit(grid, randomSource);
  const shortestPath = findShortestPath(grid, start, exit);

  if (shortestPath.length === 0) {
    throw new Error("Generated maze has no path from start to exit.");
  }

  return {
    seed: randomSource.seed,
    name: "Forest Trail",
    biome: config.biome,
    difficulty: config.difficulty,
    grid,
    start,
    exit,
    shortestPath,
    collectibles: [],
    obstacles: [],
    decorations: [],
    metrics: calculateMetrics(grid, shortestPath.length - 1),
    completionRule: config.completionRule,
  };
}
