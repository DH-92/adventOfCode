#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  WORD,
  bench,
  Logger,
  sum,
  getPrimes,
  PARAGRAPH,
  LINE,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const filled = '@'

const part1 = (path: string): string | number => {
  const inRange = (target: number, rangeStart: number, rangeEnd: number): boolean =>
    target >= rangeStart && target <= rangeEnd

  const input = inputHandler.toArray(path, PARAGRAPH).map(line => line.split(LINE))

  const freshRanges: [number, number][] = input[0].map(
    line => line.split('-').map(Number) as [number, number],
  )
  return input[1].map(Number).filter(ingredient => freshRanges.find(r => inRange(ingredient, ...r)))
    .length
}

const part2 = (path: string): string | number => {
  const inRange = (target: number, rangeStart: number, rangeEnd: number): boolean =>
    target >= rangeStart && target <= rangeEnd

  const input = inputHandler.toArray(path, PARAGRAPH).map(line => line.split(LINE))

  const freshRanges: [number, number][] = input[0]
    .map(line => line.split('-').map(Number) as [number, number])
    .sort((a, b) => a[0] - b[0])

  const mergedRanges: [number, number][] = []

  for (const [a, b] of freshRanges) {
    const intersectingRanges = mergedRanges.filter(([c, d]) => inRange(a, c, d))
    if (intersectingRanges.length === 0) {
      mergedRanges.push([a, b])
      continue
    }

    mergedRanges.forEach(([c, d], i) => {
      const rangeIntersectsA = inRange(a, c, d)
      if (!rangeIntersectsA) {
        return
      }
      const rangeIntersectsB = inRange(b, c, d)
      if (rangeIntersectsB) {
        // this range is fully covered - do nothing
        return
      }
      mergedRanges[i][1] = b
    })
  }

  return mergedRanges.map(([a, b]) => b - a + 1).reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 3)
bench(logger, 'part 1 input', () => part1(INPUT), 770)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 14)
bench(logger, 'part 2 input', () => part2(INPUT), 357674099117260)
