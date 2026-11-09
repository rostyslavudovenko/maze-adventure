import type { CellWalls } from "./maze";
import type { Direction } from "./direction";

export const OPPOSITE_DIRECTIONS: Readonly<Record<Direction, Direction>> = {
  up: "down",
  right: "left",
  down: "up",
  left: "right",
};

export function getOppositeDirection(direction: Direction): Direction {
  return OPPOSITE_DIRECTIONS[direction];
}

export function hasWall(walls: CellWalls, direction: Direction): boolean {
  switch (direction) {
    case "up":
      return walls.top;
    case "right":
      return walls.right;
    case "down":
      return walls.bottom;
    case "left":
      return walls.left;
  }
}
