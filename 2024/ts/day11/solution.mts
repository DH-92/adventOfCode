#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  LINE,
  transpose,
  PARAGRAPH,
  sum,
  getGrid,
  reshape,
  WORD,
} from '../helpers/index.mjs'
import { MultiSet } from '../helpers/multiSet.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const rule = (stone: number): Array<number> => {
  /**
   * If the stone is engraved with the number 0
   * It is replaced by a stone engraved with the number 1.

   * If the stone is engraved with a number that has an even number of digits
   * it is replaced by two stones.
   * The left half of the digits are engraved on the new left stone
   * and the right half of the digits are engraved on the new right stone.
   * (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)

   * If none of the other rules apply
   * the stone is replaced by a new stone;
   * the old stone's number multiplied by 2024 is engraved on the new stone.
   *  */

  if (stone === 0) {
    return [1]
  }
  const digits = Math.floor(Math.log10(stone)) + 1
  if (digits % 2) {
    return [stone * 2024]
  }
  const half = 10 ** (digits / 2)
  return [Math.floor(stone / half), stone % half]
}

const part1 = (path: string, loops: number): string | number => {
  let stones = new MultiSet<number>()
  inputHandler.toArray(path, WORD).forEach(stone => stones.add(Number(stone)))

  for (let i = 0; i < loops; i++) {
    stones = [...stones.multiplicities()].reduce((newStones, [val, count]) => {
      rule(val).forEach(stone => newStones.add(stone, count))
      return newStones
    }, new MultiSet<number>())
  }
  return stones.size
}

const part2 = (path: string, loops: number): string | number =>
  new Array(loops).fill(false).reduce(
    (oldSet: MultiSet<number>) => {
      const newSet = new MultiSet<number>()
      oldSet.forEachMultiplicity((count, val) => rule(val).forEach(val => newSet.add(val, count)))
      return newSet
    },
    inputHandler
      .toArray(path, WORD)
      .reduce((set, val): MultiSet<number> => set.add(Number(val)), new MultiSet<number>()),
  ).size

console.clear()
logger.clear()
bench(logger, 'part 1 example', () => part1('example2.txt', 1), 7)
bench(logger, 'part 1 example', () => part1(EXAMPLE, 6), 22)
bench(logger, 'part 1 example', () => part1(EXAMPLE, 25), 55312)
bench(logger, 'part 1 input', () => part1(INPUT, 25), 183484)
bench(logger, 'part 2 input', () => part2(INPUT, 75), 218817038947400)

/* the cursed zone

const part1 = (path: string, loops: number): number =>
  Object.values(
    new Array(loops).fill(false).reduce(
      (stones: Stones): Stones =>
        Object.entries(stones).reduce(
          (stones, [v1, count]) => (
            rule(+v1).forEach(stone => (stones[stone] = (stones[stone] ?? 0) + count)), stones
          ),
          {} as Stones,
        ),
      inputHandler
        .toArray(path, WORD)
        .map(Number)
        .reduce((stones, stone) => {
          stones[stone] = (stones[stone] ?? 0) + 1
          return stones
        }, {} as Stones),
    ),
  ).reduce(sum)

  const part2 = (path: string, loops: number): string | number => {
  let stones = inputHandler
    .toArray(path, WORD)
    .reduce((stones, stone) => stones.add(Number(stone)), new MultiSet<number>())

  for (let i = 0; i < loops; i++) {
    stones = [...stones.multiplicities()].reduce((newStones, [stone, count]) => {
      if (stone === 0) return newStones.add(1, count)
      const digits = Math.floor(Math.log10(stone)) + 1
      if (digits % 2) {
        return newStones.add(stone * 2024, count)
      }
      const half = 10 ** (digits / 2)
      return newStones.add(Math.floor(stone / half), count).add(stone % half, count)
    }, new MultiSet<number>())
  }
  return stones.size
}

*/
