const DEFAULT_SEED = "maze-adventure";

export type RandomSource = {
  readonly seed: string;
  randomFloat(): number;
  randomInt(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
};

export function normalizeSeed(seed: string): string {
  const normalizedSeed = seed.normalize("NFKC").trim();

  return normalizedSeed || DEFAULT_SEED;
}

function hashSeed(seed: string): number {
  let hash = 1779033703 ^ seed.length;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
  hash = Math.imul(hash ^ (hash >>> 13), 3266489909);

  return (hash ^ (hash >>> 16)) >>> 0;
}

function createGenerator(initialState: number): () => number {
  let state = initialState;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;

    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRandomSource(seed: string): RandomSource {
  const normalizedSeed = normalizeSeed(seed);
  const nextRandom = createGenerator(hashSeed(normalizedSeed));

  const randomFloat = (): number => nextRandom();

  const randomInt = (min: number, max: number): number => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new TypeError("Random integer boundaries must be integers.");
    }

    if (max <= min) {
      throw new RangeError("Maximum boundary must be greater than minimum boundary.");
    }

    return Math.floor(randomFloat() * (max - min)) + min;
  };

  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) {
      throw new RangeError("Cannot pick an item from an empty collection.");
    }

    return items[randomInt(0, items.length)] as T;
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
      const targetIndex = randomInt(0, index + 1);

      [shuffledItems[index], shuffledItems[targetIndex]] = [shuffledItems[targetIndex] as T, shuffledItems[index] as T];
    }

    return shuffledItems;
  };

  return {
    seed: normalizedSeed,
    randomFloat,
    randomInt,
    pick,
    shuffle,
  };
}
