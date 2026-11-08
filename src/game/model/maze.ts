import type { Position } from "./position";

export type CellWalls = {
  readonly top: boolean;
  readonly right: boolean;
  readonly bottom: boolean;
  readonly left: boolean;
};

export type Cell = {
  readonly position: Position;
  readonly walls: CellWalls;
};

export type MazeGrid = readonly (readonly Cell[])[];
