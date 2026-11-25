import { DIRECTIONS, getPositionKey, hasWall, isPositionWithinBounds, movePosition } from "../model";
import type { Cell, MazeGrid, Position } from "../model";
import type { RandomSource } from "../random";

export type StartAndExit = {
  readonly start: Position;
  readonly exit: Position;
};

type QueuedPosition = {
  readonly position: Position;
  readonly distance: number;
};

function validateGrid(grid: MazeGrid): {
  readonly width: number;
  readonly height: number;
} {
  const height = grid.length;

  if (height === 0) {
    throw new RangeError("Maze grid must contain at least one row.");
  }

  const width = grid[0]?.length ?? 0;

  if (width === 0) {
    throw new RangeError("Maze grid must contain at least one column.");
  }

  const hasInvalidRow = grid.some((row) => row.length !== width);

  if (hasInvalidRow) {
    throw new RangeError("Maze grid must be rectangular.");
  }

  return {
    width,
    height,
  };
}

function getCell(grid: MazeGrid, position: Position): Cell {
  const cell = grid[position.y]?.[position.x];

  if (!cell) {
    throw new RangeError(`Cell at position ${getPositionKey(position)} does not exist.`);
  }

  return cell;
}

function getConnectedNeighbours(grid: MazeGrid, position: Position, width: number, height: number): Position[] {
  const cell = getCell(grid, position);

  return DIRECTIONS.flatMap((direction) => {
    if (hasWall(cell.walls, direction)) {
      return [];
    }

    const neighbourPosition = movePosition(position, direction);

    if (!isPositionWithinBounds(neighbourPosition, width, height)) {
      return [];
    }

    return [neighbourPosition];
  });
}

function findFarthestPositions(grid: MazeGrid, origin: Position, width: number, height: number): Position[] {
  const queue: QueuedPosition[] = [
    {
      position: origin,
      distance: 0,
    },
  ];
  const visitedPositions = new Set<string>([getPositionKey(origin)]);

  let queueIndex = 0;
  let farthestDistance = 0;
  let farthestPositions: Position[] = [origin];

  while (queueIndex < queue.length) {
    const current = queue[queueIndex];

    queueIndex += 1;

    if (!current) {
      continue;
    }

    if (current.distance > farthestDistance) {
      farthestDistance = current.distance;
      farthestPositions = [current.position];
    } else if (current.distance === farthestDistance) {
      farthestPositions.push(current.position);
    }

    const neighbours = getConnectedNeighbours(grid, current.position, width, height);

    for (const neighbour of neighbours) {
      const neighbourKey = getPositionKey(neighbour);

      if (visitedPositions.has(neighbourKey)) {
        continue;
      }

      visitedPositions.add(neighbourKey);
      queue.push({
        position: neighbour,
        distance: current.distance + 1,
      });
    }
  }

  return farthestPositions;
}

export function selectStartAndExit(grid: MazeGrid, randomSource: RandomSource): StartAndExit {
  const { width, height } = validateGrid(grid);

  const initialPosition: Position = {
    x: randomSource.randomInt(0, width),
    y: randomSource.randomInt(0, height),
  };

  const startCandidates = findFarthestPositions(grid, initialPosition, width, height);
  const start = randomSource.pick(startCandidates);

  const exitCandidates = findFarthestPositions(grid, start, width, height);
  const exit = randomSource.pick(exitCandidates);

  return {
    start,
    exit,
  };
}
