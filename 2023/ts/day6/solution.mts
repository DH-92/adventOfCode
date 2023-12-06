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
  const lines = inputHandler.toArray(path, LINE)
  const [times, distances] = lines.map(l =>
    l
      .split(':')[1]
      .trim()
      .split(/[^\d]+/)
      .map(Number)
  )
  let s = 1
  times.forEach((t, i) => {
    let w = 0
    for (let h = 1; h <= t; h++) {
      const d = h * (t - h)
      if (d > distances[i]) w++
      // console.log(`holding for ${h} took ${d} vs ${distances[i]}`)
    }
    console.log(w)
    // process.exit(0)
    s *= w
  })
  return s
}

const part2 = (path: string): string | number => {
  return 0
}

// console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 288)
  bench(logger, 'part 1 input', () => part1(INPUT), 0)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 0)
  bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {
  // console.log(e)
}
