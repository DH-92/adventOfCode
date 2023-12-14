#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  sum,
  PARAGRAPH,
  transpose,
  LINE,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

enum DIRS {
  'north' = 0,
  'west' = 1,
  'south' = 2,
  'east' = 3,
}

enum PIECES {
  'air' = 0,
  'moving' = 1,
  'stuck' = 2,
}

const part1 = (path: string): string | number => {
  const grid: number[][] = inputHandler
    .toArray(path, LINE)
    .map(l =>
      l
        .replaceAll('.', PIECES.air)
        .replaceAll('O', PIECES.moving)
        .replaceAll('#', PIECES.stuck)
        .split('')
        .map(Number)
    )

  const roll = (dir: DIRS, y: number, x: number) => {
    const nextY = y - 1
    if (0 > nextY) return
    if (grid[nextY][x]) return

    grid[nextY][x] = PIECES.moving
    grid[y][x] = 0
    roll(dir, nextY, x)
  }

  const h = grid.length
  for (let x = 0; x < h; x++)
    for (let y = 1; y < h; y++) if (grid[y][x] === PIECES.moving) roll(DIRS.north, y, x)

  return grid.flatMap((l, i) => l.map(x => (x === PIECES.moving ? h - i : 0))).reduce(sum)
}

const part2 = (path: string): string | number => {
  const grid: number[][] = inputHandler
    .toArray(path, LINE)
    .map(l =>
      l
        .replaceAll('.', PIECES.air)
        .replaceAll('O', PIECES.moving)
        .replaceAll('#', PIECES.stuck)
        .split('')
        .map(Number)
    )
  const h = grid.length

  const xy = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ]
  const roll = (dir: DIRS, y: number, x: number) => {
    const nextY = y + xy[dir][0]
    if (0 > nextY || nextY == h) return
    const nextX = x + xy[dir][1]
    if (0 > nextX || nextX == h) return
    if (grid[nextY][nextX]) return

    grid[nextY][nextX] = PIECES.moving
    grid[y][x] = 0
    roll(dir, nextY, nextX)
  }

  const cycle = () => {
    //roll north
    for (let x = 0; x < h; x++)
      for (let y = 1; y < h; y++) if (grid[y][x] === PIECES.moving) roll(DIRS.north, y, x)
    //roll west
    for (let x = 1; x < h; x++)
      for (let y = 0; y < h; y++) if (grid[y][x] === PIECES.moving) roll(DIRS.west, y, x)
    //roll south
    for (let x = 0; x < h; x++)
      for (let y = h - 2; y >= 0; y--) if (grid[y][x] === PIECES.moving) roll(DIRS.south, y, x)
    //roll east
    for (let x = h - 2; x >= 0; x--)
      for (let y = 0; y < h; y++) if (grid[y][x] === PIECES.moving) roll(DIRS.east, y, x)
  }

  const getScore = () =>
    grid.flatMap((l, i) => l.map(x => (x === PIECES.moving ? h - i : 0))).reduce(sum)

  const keyToI = {}
  let loopSize
  for (let i = 0; i < 1000; i++) {
    if (loopSize && i % loopSize === 1000000000 % loopSize) return getScore()
    if (!loopSize) {
      const key = JSON.stringify(grid)
      if (keyToI[key]) {
        loopSize = i - keyToI[key]
      } else keyToI[key] = i
    }
    cycle()
  }
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 136)
  bench(logger, 'part 1 input', () => part1(INPUT), 112048)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 64)
  bench(logger, 'part 2 input', () => part2(INPUT), 105606)
} catch (e) {
  console.error(e)
}
