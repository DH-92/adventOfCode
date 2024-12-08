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
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  const calc = (target: number, total: number, [next, ...rest]: number[]): number | undefined => {
    if (!next) return total === target ? target : undefined
    if (total > target) return undefined
    // return calc(target, Number(`${total}${next}`), rest) ?? calc(target, total * next, rest) ?? calc(target, total + next, rest)
    return calc(target, total * next, rest) ?? calc(target, total + next, rest)
  }

  return inputHandler
    .toArray(path, LINE)
    .map(line => line.match(/\d+/g)?.map(Number)!)
    .map(([target, first, ...rest]) => calc(target, first, rest) ?? 0)
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const operations = [
    (next: number, total: number) => Number(`${total}${next}`),
    (next: number, total: number) => total * next,
    (next: number, total: number) => total + next,
  ]
  const calc = (target: number, total: number, [next, ...rest]: number[]): number | undefined => {
    if (total > target) return undefined
    if (!next) return total === target ? target : undefined
    return operations
      .map(op => calc(target, op(next, total), rest))
      .find(Boolean)
  }

  return inputHandler
    .toArray(path, LINE)
    .map(line => line.match(/\d+/g)?.map(Number)!)
    .map(([target, first, ...rest]) => calc(target, first, rest) ?? 0)
    .reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 3749)
bench(logger, 'part 1 input', () => part1(INPUT), 1399219271639)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 11387)
bench(logger, 'part 2 input', () => part2(INPUT), 275791737999003)
