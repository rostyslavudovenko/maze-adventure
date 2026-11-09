export const DIRECTIONS = ["up", "right", "down", "left"] as const;

export type Direction = (typeof DIRECTIONS)[number];
