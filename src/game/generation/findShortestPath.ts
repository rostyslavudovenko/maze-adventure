import { DIRECTIONS, getOppositeDirection, getPositionKey, hasWall, movePosition } from "../model";
import type { MazeGrid, Position } from "../model";

type PathNode = {
  readonly position: Position;
  readonly previous: PathNode | null;
};

function isGridCell(grid: MazeGrid, position: Position): boolean {
  return Number.isInteger(position.x) && Number.isInteger(position.y) && grid[position.y]?.[position.x] !== undefined;
}

function reconstructPath(node: PathNode): Position[] {
  const path: Position[] = [];
  let current: PathNode | null = node;

  while (current !== null) {
    path.push(current.position);
    current = current.previous;
  }

  return path.reverse();
}

export function findShortestPath(grid: MazeGrid, start: Position, exit: Position): Position[] {
  if (!isGridCell(grid, start) || !isGridCell(grid, exit)) {
    throw new RangeError("Start and exit must be valid maze cells.");
  }

  const startKey = getPositionKey(start);
  const exitKey = getPositionKey(exit);
  const visited = new Set<string>([startKey]);
  const queue: PathNode[] = [{ position: start, previous: null }];

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];

    if (!current) {
      continue;
    }

    if (getPositionKey(current.position) === exitKey) {
      return reconstructPath(current);
    }

    const cell = grid[current.position.y]?.[current.position.x];

    if (!cell) {
      continue;
    }

    for (const direction of DIRECTIONS) {
      if (hasWall(cell.walls, direction)) {
        continue;
      }

      const next = movePosition(current.position, direction);
      const nextCell = grid[next.y]?.[next.x];

      if (!nextCell || hasWall(nextCell.walls, getOppositeDirection(direction))) {
        continue;
      }

      const nextKey = getPositionKey(next);

      if (visited.has(nextKey)) {
        continue;
      }

      visited.add(nextKey);
      queue.push({ position: next, previous: current });
    }
  }

  return [];
}
