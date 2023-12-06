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

function binarySearch(time: number, dist: number) {
  let start = 1
  let end = Math.floor(time / 2)
  const isWin = (h: number): boolean => h * (time - h) > dist
  while (start <= end) {
    const mid = start + Math.floor((end - start) / 2)
    if (isWin(mid) && !isWin(mid - 1)) return mid
    if (isWin(mid - 1) && isWin(mid)) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }
}

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const [times, dists] = lines.map(l =>
    l
      .split(':')[1]
      .trim()
      .split(/[^\d]+/)
      .map(Number)
  )
  return times.reduce((s, time, i) => {
    const h = binarySearch(time, dists[i])
    return s * ((time % 2 !== 0 ? +2 : +1) + (h - Math.floor(time / 2)) * -2)
  }, 1)
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const [time, dist] = lines.map(l => l.split(':')[1].trim().split(/\s+/).join('')).map(Number)
  const h = binarySearch(time, dist)!
  return (time % 2 !== 0 ? +2 : +1) + (h - Math.floor(time / 2)) * -2
  // for (let h = 1; h <= Math.floor(time / 2); h++) {
  //   if (h * (time - h) > dist) return (time % 2 !== 0 ? +2 : +1) + (h - Math.floor(time / 2)) * -2
  // }
  throw 'impossible'
}

// console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 288)
  bench(logger, 'part 1 input', () => part1(INPUT), 4568778)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 71503)
  bench(logger, 'part 2 input', () => part2(INPUT), 28973936)
} catch (e) {
  console.log(e)
}
