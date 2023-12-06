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
  const [times, dists] = lines.map(l =>
    l
      .split(':')[1]
      .trim()
      .split(/[^\d]+/)
      .map(Number)
  )
  let s = 1
  times.forEach((t, i) => {
    let w = 0
    for (let h = 1; h <= t / 2; h++) {
      if (h * (t - h) > dists[i]) w += 2
    }
    if (t % 2 === 0) w--
    s *= w
  })
  return s
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const [time, dist] = lines.map(l => l.split(':')[1].trim().split(/\s+/).join('')).map(Number)
  let s = 1
  let w = 0
  for (let h = 1; h <= time / 2; h++) {
    if (h * (time - h) > dist) {
      w += 2
    }
  }
  if (time % 2 === 0) w--
  s *= w
  return s
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 288)
  bench(logger, 'part 1 input', () => part1(INPUT), 4568778)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 71503)
  bench(logger, 'part 2 input', () => part2(INPUT), 28973936)
} catch (e) {
  console.log(e)
}
