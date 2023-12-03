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
  const grid = getGrid<Set<[number, string]>>(() => new Set(), 141)
  const pointers = inputHandler.toArray(path, LINE).reduce(
    (pointers, line, lineId) => {
      for (const match of line.matchAll(/\d+/dg)) {
        const [start, end] = match.indices![0]
        range(start - 1, end).forEach(x =>
          range(lineId - 1, lineId + 1).forEach(yy =>
            grid[yy][x].add([Number(match[0]), `${x},${lineId}`])
          )
        )
      }
      ;[...line.matchAll(/[^\d.]/g)].forEach(pointer => pointers.push([lineId, pointer.index!]))
      return pointers
    },
    [] as [number, number][]
  )
  return [...new Set(pointers.flatMap(([x, y]) => [...grid[x][y]]))].map(x => x[0]).reduce(sum)
}

const part2 = (path: string): string | number => {
  const grid = getGrid<Set<[number, string]>>(() => new Set(), 141)
  const pointers = inputHandler.toArray(path, LINE).reduce(
    (pointers, line, lineId) => {
      for (const match of line.matchAll(/\d+/dg)) {
        const [start, end] = match.indices![0]
        range(start - 1, end).forEach(x =>
          range(lineId - 1, lineId + 1).forEach(yy =>
            grid[yy][x].add([Number(match[0]), `${x},${lineId}`])
          )
        )
      }
      ;[...line.matchAll(/[^\d.]+/g)].forEach(pointer => pointers.push([lineId, pointer.index!]))
      return pointers
    },
    [] as [number, number][]
  )
  return pointers.reduce((sum, [y, x]) => {
    const g = grid[y][x]
    if (g.size === 2) sum += [...g].map(z => z[0]).reduce(product)
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
