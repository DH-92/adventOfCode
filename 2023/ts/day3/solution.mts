#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  bench,
  EXAMPLE,
  INPUT,
  LINE,
  Logger,
  range,
  sum,
  product,
  getGrid,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const numbers: Set<[number, string]> = new Set()
  const grid = getGrid<Set<[number, string]>>(() => new Set(), 141)
  inputHandler
    .toArray(path, LINE)
    .map((line, lineId) => {
      ;[...line.matchAll(/\d+/g)].forEach(partId =>
        range(partId.index! - 1, partId.index! + partId[0].length).forEach(x =>
          range(lineId - 1, lineId + 1).forEach(yy =>
            grid[yy][x].add([Number(partId[0]), `${x},${lineId}`])
          )
        )
      )
      return line
    })
    .forEach((line, lineId) =>
      [...line.matchAll(/[^\d.]+/g)].forEach(match =>
        [...grid[lineId][match.index!]].forEach(n => numbers.add(n))
      )
    )
  return [...numbers].map(x => x[0]).reduce(sum)
}

const part2 = (path: string): string | number => {
  const grid = getGrid<Set<[number, string]>>(() => new Set(), 141)
  return inputHandler
    .toArray(path, LINE)
    .map((line, lineId) => {
      ;[...line.matchAll(/\d+/g)].forEach(partId =>
        range(partId.index! + -1, partId.index! + partId[0].length).forEach(x =>
          range(lineId - 1, lineId + 1).forEach(yy => {
            grid[yy][x].add([Number(partId[0]), `${x},${lineId}`])
          })
        )
      )
      return line
    })
    .reduce((sum, l, y) => {
      ;[...l.matchAll(/\*/g)].forEach(match => {
        const g = grid[y][match.index!]
        if (g.size === 2) sum += [...g].map(x => x[0]).reduce(product)
      })
      return sum
    }, 0)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 4361)
  bench(logger, 'part 1 input', () => part1(INPUT), 535078)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 467835)
  bench(logger, 'part 2 input', () => part2(INPUT), 75312571)
} catch (e) {
  console.log(e)
}
