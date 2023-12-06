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
  times.forEach((time, i) => {
    let w = time % 2 !== 0 ? 0 : -1
    for (let h = Math.floor(time / 2); h >= 1; h--) {
      if (h * (time - h) <= dists[i]) break
      w += 2
    }
    s *= w
  })
  return s
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const [time, dist] = lines.map(l => l.split(':')[1].trim().split(/\s+/).join('')).map(Number)
  let wins = time % 2 !== 0 ? 0 : -1 // we double count the time / 2 if time is even so start at -1
  for (let h = Math.floor(time / 2); h >= 1; h--) {
    if (h * (time - h) <= dist) break
    wins += 2
  }
  return wins
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
