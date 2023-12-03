#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  bench,
  EXAMPLE,
  INPUT,
  WORD,
  LINE,
  PARAGRAPH,
  Logger,
  range,
  sum,
  product,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const numbers = new Set()
  const grid: Set<[Number, string]>[][] = new Array(140 + 1)
    .fill()
    .map(_ => new Array(140 + 1).fill().map(_ => new Set() as Set<Number>))
  lines.forEach((l, y) => {
    log(y, l)
    const nums = [...l.matchAll(/[0-9]+/g)]
    nums.forEach(n => {
      const num = Number(n[0])
      const start = Math.max(0, Number(n.index))
      const end = Math.min(140, Number(n.index) + n[0].length + 1)
      range(start, end).forEach(x => {
        grid[Math.max(0, y - 1)][x].add([num, `${x},${y}`])
        grid[y][x].add([num, `${x},${y}`])
        grid[Math.min(140, y + 1)][x].add([num, `${x},${y}`])
      })
      // console.log(`${num} on line ${y} touches from ${start} to ${end} (${n.index}+${n[0].length})`)
      // console.table(grid)
    })
  })
  lines.forEach((l, y) => {
    const chars = [...l.matchAll(/[^\d\.]+/g)]
    chars.forEach(c => {
      const char = c[0]
      log(`${char} on pos ${y} ${c.index} touching ${[...grid[y][c.index]]}`)
      const g = [...grid[y][c.index + 1]]
      g.forEach(n => numbers.add(n))
    })
  })
  log(numbers)
  log([...numbers].map(x => x[0]).reduce(sum))
  // console.table(grid)
  return [...numbers].map(x => x[0]).reduce(sum)
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const numbers = new Set()
  const grid: Set<[Number, string]>[][] = new Array(140 + 1)
    .fill()
    .map(_ => new Array(140 + 1).fill().map(_ => new Set() as Set<Number>))
  let sum = 0
  lines.forEach((l, y) => {
    log(y, l)
    const nums = [...l.matchAll(/[0-9]+/g)]
    nums.forEach(n => {
      const num = Number(n[0])
      const start = Math.max(0, Number(n.index))
      const end = Math.min(140, Number(n.index) + n[0].length + 1)
      range(start, end).forEach(x => {
        grid[Math.max(0, y - 1)][x].add([num, `${x},${y}`])
        grid[y][x].add([num, `${x},${y}`])
        grid[Math.min(140, y + 1)][x].add([num, `${x},${y}`])
      })
      // console.log(`${num} on line ${y} touches from ${start} to ${end} (${n.index}+${n[0].length})`)
      // console.table(grid)
    })
  })
  lines.forEach((l, y) => {
    const chars = [...l.matchAll(/\*/g)]
    chars.forEach(c => {
      const char = c[0]
      log(`${char} on pos ${y} ${c.index} touching ${[...grid[y][c.index]].map(x => x[0])}`)
      const g = grid[y][c.index + 1]
      log(g.size)
      if (g.size === 2) {
        log(`found two ${[...g].map(x => x[0])} === ${[...g].map(x => x[0]).reduce(product)}`)
        sum += [...g].map(x => x[0]).reduce(product)
      }
      g.forEach(n => numbers.add(n))
    })
  })

  return sum
}

// console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 4361)
  bench(logger, 'part 1 input', () => part1(INPUT), 535078)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 467835)
  bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {}
