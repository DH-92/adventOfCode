#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  transpose,
  range,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const grid = inputHandler.toArray(path).map(l => l.split(''))
  const grid2 = []
  for (let y = 0; y < grid.length; y++) {
    if (grid[y].every(c => c === '.')) grid2.push(grid[y])
    grid2.push(grid[y])
  }

  const grid3 = transpose(grid2)
  const grid4 = []
  for (let y = 0; y < grid3.length; y++) {
    if (grid3[y].every(c => c === '.')) grid4.push(grid3[y])
    grid4.push(grid3[y])
  }
  const grid5 = transpose(grid4)

  const nodes = []
  grid5.forEach((r, y) => r.forEach((c, x) => c === '#' && nodes.push({ x, y })))
  let sum = 0
  for (let n = 0; n < nodes.length; n++) {
    for (let nn = n + 1; nn < nodes.length; nn++) {
      const a = nodes[n]
      const b = nodes[nn]
      sum += Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }
  }
  return sum
}

const part2 = (path: string): string | number => {
  const grid = inputHandler.toArray(path).map(l => l.split(''))
  const slowY = []
  const slowX = []
  grid.forEach((l, i) => {
    if (l.every(c => c === '.')) slowY.push(i)
  })
  transpose(grid).forEach((l, i) => {
    if (l.every(c => c === '.')) slowX.push(i)
  })

  const nodes = []
  grid.forEach((r, y) => {
    r.forEach((c, x) => {
      if (c === '#') nodes.push({ x, y })
    })
  })
  let sum = 0
  for (let n = 0; n < nodes.length; n++) {
    for (let nn = n + 1; nn < nodes.length; nn++) {
      const a = nodes[n]
      const b = nodes[nn]
      let slows = 0
      range(Math.min(a.x, b.x), Math.max(a.x, b.x)).forEach(x => {
        if (slowX.includes(x)) slows++
      })
      range(Math.min(a.y, b.y), Math.max(a.y, b.y)).forEach(y => {
        if (slowY.includes(y)) slows++
      })
      sum += Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + slows * 999999
    }
  }
  return sum
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 374)
  bench(logger, 'part 1 input', () => part1(INPUT), 10292708)
  // bench(logger, 'part 2 example', () => part2(EXAMPLE), 1)
  bench(logger, 'part 2 input', () => part2(INPUT), 790194712336)
} catch (e) {
  console.error(e)
}
