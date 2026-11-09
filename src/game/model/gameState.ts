export const GAME_STATUSES = ["idle", "playing", "paused", "completed"] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];
