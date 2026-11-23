import { DIRECTIONS, getOppositeDirection, getPositionKey, isPositionWithinBounds, movePosition } from "../model";
import type { Direction, MazeGrid, Position } from "../model";
import type { RandomSource } from "../random";

type MutableCellWalls = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

type MutableCell = {
  position: Position;
  walls: MutableCellWalls;
};

type Neighbour = {
  readonly direction: Direction;
  readonly position: Position;
};

function validateDimensions(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new TypeError("Maze dimensions must be integers.");
  }

  if (width < 1 || height < 1) {
    throw new RangeError("Maze dimensions must be greater than zero.");
  }
}

function createGrid(width: number, height: number): MutableCell[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      position: {
        x,
        y,
      },
      walls: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      },
    })),
  );
}

function removeWall(cell: MutableCell, direction: Direction): void {
  switch (direction) {
    case "up":
      cell.walls.top = false;
      break;
    case "right":
      cell.walls.right = false;
      break;
    case "down":
      cell.walls.bottom = false;
      break;
    case "left":
      cell.walls.left = false;
      break;
  }
}

function connectCells(currentCell: MutableCell, nextCell: MutableCell, direction: Direction): void {
  removeWall(currentCell, direction);
  removeWall(nextCell, getOppositeDirection(direction));
}

function getCell(grid: MutableCell[][], position: Position): MutableCell {
  const cell = grid[position.y]?.[position.x];

  if (!cell) {
    throw new RangeError(`Cell at position ${getPositionKey(position)} does not exist.`);
  }

  return cell;
}

function getUnvisitedNeighbours(
  position: Position,
  width: number,
  height: number,
  visitedPositions: ReadonlySet<string>,
): Neighbour[] {
  return DIRECTIONS.flatMap((direction) => {
    const neighbourPosition = movePosition(position, direction);

    if (
      !isPositionWithinBounds(neighbourPosition, width, height) ||
      visitedPositions.has(getPositionKey(neighbourPosition))
    ) {
      return [];
    }

    return [
      {
        direction,
        position: neighbourPosition,
      },
    ];
  });
}

export function generateMaze(width: number, height: number, randomSource: RandomSource): MazeGrid {
  validateDimensions(width, height);

  const grid = createGrid(width, height);
  const startPosition: Position = {
    x: randomSource.randomInt(0, width),
    y: randomSource.randomInt(0, height),
  };

  const visitedPositions = new Set<string>([getPositionKey(startPosition)]);
  const cellStack: Position[] = [startPosition];

  while (cellStack.length > 0) {
    const currentPosition = cellStack[cellStack.length - 1];

    if (!currentPosition) {
      break;
    }

    const unvisitedNeighbours = getUnvisitedNeighbours(currentPosition, width, height, visitedPositions);

    if (unvisitedNeighbours.length === 0) {
      cellStack.pop();
      continue;
    }

    const nextNeighbour = randomSource.pick(unvisitedNeighbours);
    const currentCell = getCell(grid, currentPosition);
    const nextCell = getCell(grid, nextNeighbour.position);

    connectCells(currentCell, nextCell, nextNeighbour.direction);

    visitedPositions.add(getPositionKey(nextNeighbour.position));
    cellStack.push(nextNeighbour.position);
  }

  return grid;
}
