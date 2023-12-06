#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  bench,
  EXAMPLE,
  INPUT,
  Logger,
} from '../helpers/index.mjs'

const logger = new Logger()
const log = logger.log

const exArr = new InputHandler(process.cwd(), EXAMPLE).get()
const inArr = new InputHandler(process.cwd(), INPUT).get()

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

function solve(time: number, dist: number) {
  const inner = Math.sqrt(Math.pow(time, 2) - 4 * (dist + 1))
  return Math.floor((time + inner) / 2) - Math.ceil((time - inner) / 2) + 1
}

const part1 = (file: string): string | number => {
  // const [times, dists] = file.split(/\n/).map(l => l.split(':')[1].trim().split(/\s+/).map(Number))
  // return times.reduce((s, time, i) => s * bSearch(time, dists[i]), 1)
  const a = file.split(/\D+/)
  const l = a.length >> 1
  let res = 1
  for (let i = 1; i <= l; i++) res *= solve(parseInt(a[i]), parseInt(a[i + l]))
  return res
}

const part2 = (file: string): string | number => {
  const [time, dist] = file.split(/\n/).map(l => parseInt(l.split(/\D+/).join('')))
  return solve(time, dist)
}

console.clear()
try {
  console.time()
  bench(logger, 'part 1 example', () => part1(exArr), 288)
  bench(logger, 'part 1 input', () => part1(inArr), 4568778)
  bench(logger, 'part 2 example', () => part2(exArr), 71503)
  bench(logger, 'part 2 input', () => part2(inArr), 28973936)
  console.timeEnd()
} catch (e) {
  console.log(e)
}
