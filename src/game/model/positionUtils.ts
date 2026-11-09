import type { Direction } from './direction';
import type { Position } from './position';
const DIRECTION_OFFSETS: Readonly<Record<Direction, Position>> = {
  up: {
	x: 0,
	y: -1,
  },
  right: {
	x: 1,
	y: 0,
  },
  down: {
	x: 0,
	y: 1,
  },
  left: {
	x: -1,
	y: 0,
  },
};
export function arePositionsEqual(
  firstPosition: Position,
  secondPosition: Position,
): boolean {
  return (
	firstPosition.x === secondPosition.x &&
	firstPosition.y === secondPosition.y
  );
}
export function movePosition(
  position: Position,
  direction: Direction,
): Position {
  const offset = DIRECTION_OFFSETS[direction];
  return {
	x: position.x + offset.x,
	y: position.y + offset.y,
  };
}
export function isPositionWithinBounds(
  position: Position,
  width: number,
  height: number,
): boolean {
  return (
	position.x >= 0 &&
	position.x < width &&
	position.y >= 0 &&
	position.y < height
  );
}
export function getPositionKey(position: Position): string {
  return `${position.x},${position.y}`;
}
export function getManhattanDistance(
  firstPosition: Position,
  secondPosition: Position,
): number {
  return (
	Math.abs(firstPosition.x - secondPosition.x) +
	Math.abs(firstPosition.y - secondPosition.y)
  );
}
