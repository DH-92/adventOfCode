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

const inH = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

function bSearch(time: number, dist: number) {
  let start = 1
  let end = Math.floor(time / 2)
  // Find lowest holdTime value that can still win
  const isWin = (h: number): boolean => h * (time - h) > dist
  while (true) {
    const mid = start + Math.floor((end - start) / 2)
    if (!isWin(mid)) {
      start = mid + 1
      continue
    }
    if (isWin(mid - 1)) {
      end = mid - 1
      continue
    }
    // holdTime = mid
    // Then return 2 * the difference between the minimum winning hold time and the mid point
    // We then add a magic constant depending on if the time value was even
    return 2 * (Math.floor(time / 2) - mid) + (time % 2 !== 0 ? +2 : +1)
  }
}

const part1 = (path: string): string | number => {
  const [times, dists] = inH.toArray(path).map(l => l.split(':')[1].trim().split(/\s+/).map(Number))
  return times.reduce((s, time, i) => s * bSearch(time, dists[i]), 1)
}

const part2 = (path: string): string | number => {
  const [time, dist] = inH.toArray(path).map(l => Number(l.split(':')[1].replace(/\s+/g, '')))
  return bSearch(time, dist)
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
