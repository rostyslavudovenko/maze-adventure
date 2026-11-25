import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const directions = [
  { dx: 0, dy: -1, wall: "top", opposite: "bottom" },
  { dx: 1, dy: 0, wall: "right", opposite: "left" },
  { dx: 0, dy: 1, wall: "bottom", opposite: "top" },
  { dx: -1, dy: 0, wall: "left", opposite: "right" },
];

function getCellIndex({ x, y }, width) {
  return y * width + x;
}

function getDistances(grid, start, width) {
  const distances = new Map([[getCellIndex(start, width), 0]]);
  const queue = [start];

  for (let index = 0; index < queue.length; index += 1) {
    const position = queue[index];
    const cell = grid[position.y]?.[position.x];
    const distance = distances.get(getCellIndex(position, width));

    assert.ok(cell, `Missing cell at (${position.x}, ${position.y})`);

    for (const { dx, dy, wall, opposite } of directions) {
      const next = { x: position.x + dx, y: position.y + dy };
      const neighbour = grid[next.y]?.[next.x];

      if (!neighbour) {
        assert.equal(cell.walls[wall], true, `Open boundary at (${position.x}, ${position.y}): ${wall}`);
        continue;
      }

      assert.equal(
        cell.walls[wall],
        neighbour.walls[opposite],
        `Asymmetric walls between (${position.x}, position.y)and({next.x}, ${next.y})`,
      );

      const nextIndex = getCellIndex(next, width);

      if (cell.walls[wall] === false && !distances.has(nextIndex)) {
        distances.set(nextIndex, distance + 1);
        queue.push(next);
      }
    }
  }

  return distances;
}

function assertShortestPath(level, expectedLength) {
  const { grid, start, exit, shortestPath, metrics } = level;

  assert.deepEqual(shortestPath[0], start);
  assert.deepEqual(shortestPath.at(-1), exit);
  assert.equal(shortestPath.length - 1, expectedLength);
  assert.equal(metrics.shortestPathLength, expectedLength);

  for (let index = 1; index < shortestPath.length; index += 1) {
    const from = shortestPath[index - 1];
    const to = shortestPath[index];
    const direction = directions.find(({ dx, dy }) => from.x + dx === to.x && from.y + dy === to.y);

    assert.ok(direction, `Non-adjacent path cells: (${from.x}, from.y)and({to.x}, ${to.y})`);
    assert.equal(grid[from.y][from.x].walls[direction.wall], false);
    assert.equal(grid[to.y][to.x].walls[direction.opposite], false);
  }
}

test("procedural level generation", async (t) => {
  const vite = await createServer({
    configFile: false,
    appType: "custom",
    server: { middlewareMode: true, hmr: false },
  });

  try {
    const { LEVEL_PRESETS } = await vite.ssrLoadModule("/src/game/config/index.ts");
    const { generateLevel } = await vite.ssrLoadModule("/src/game/generation/index.ts");

    for (const [difficulty, config] of Object.entries(LEVEL_PRESETS)) {
      await t.test(`${difficulty}: deterministic, connected, and solvable`, () => {
        const level = generateLevel(config);
        const { width, height } = config;

        assert.deepEqual(generateLevel({ ...config }), level);
        assert.equal(level.grid.length, height);
        assert.ok(level.grid.every((row) => row.length === width));
        assert.notDeepEqual(level.start, level.exit);

        const distances = getDistances(level.grid, level.start, width);
        const exitDistance = distances.get(getCellIndex(level.exit, width));

        assert.equal(distances.size, width * height);
        assert.equal(level.metrics.reachableCellCount, distances.size);
        assert.ok(exitDistance !== undefined, "The exit must be reachable");
        assertShortestPath(level, exitDistance);
      });
    }

    await t.test("1x1: the start is the exit and the path takes zero moves", () => {
      const level = generateLevel({ ...LEVEL_PRESETS.easy, width: 1, height: 1 });

      assert.deepEqual(level.start, { x: 0, y: 0 });
      assert.deepEqual(level.exit, level.start);
      assert.equal(getDistances(level.grid, level.start, 1).size, 1);
      assert.equal(level.metrics.reachableCellCount, 1);
      assertShortestPath(level, 0);
    });
  } finally {
    await vite.close();
  }
});
