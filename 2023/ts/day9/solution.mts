#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  LINE,
  sum,
  bench,
  Logger,
  range,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const toNumsArr = (l: string): number[] => l.match(/-?\d+/g)!.map(Number)

const solve = (curr): number => {
  if (curr.every(x => x === 0)) return 0
  const next: number[] = []
  for (let i = 1; i < curr.length; i++) {
    next.push(curr[i] - curr[i - 1])
  }
  return solve(next) + curr.at(-1)!
}

const part1 = (path: string): string | number =>
  inputHandler.toArray(path).map(toNumsArr).map(solve).reduce(sum)

const part2 = (path: string): string | number =>
  inputHandler
    .toArray(path)
    .map(toNumsArr)
    .map(l => l.reverse())
    .map(solve)
    .reduce(sum)

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 114)
  bench(logger, 'part 1 input', () => part1(INPUT), 2043677056)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 2)
  bench(logger, 'part 2 input', () => part2(INPUT), 1062)
} catch (e) {
  console.error(e)
}
