#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, WORD, bench, Logger } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const isSafe = (line: number[]): boolean => {
  // only increasing or decreasing
  const sortedAsc = line.toSorted((a, b) => a - b)
  const isAscending = line.every((x, i) => x === sortedAsc[i])

  if (!isAscending) {
    const sortedDsc = [...sortedAsc].reverse()
    const isDescending = line.every((x, i) => x === sortedDsc[i])
    if (!isDescending) {
      return false
    }
  }

  // adjectent levels differ by at least 1 and at most 3
  const isChanged = (a: number, i: number, arr: number[]) => !(arr[i + 1] - a < 1)

  const isChanging = sortedAsc.every(isChanged)
  if (!isChanging) return false

  const isChangingSlow = (a: number, i: number, arr: number[]) => !(arr[i + 1] - a > 3)
  const diffsBig = sortedAsc.every(isChangingSlow)

  if (!diffsBig) {
    return false
  }

  return true
}

const part1 = (path: string): string | number =>
  inputHandler
    .toArray(path)
    .map(line => line.split(WORD).map(Number))
    .filter(isSafe).length

const isSafeTwo = (line: number[]): boolean => {
  if (isSafe(line)) {
    return true
  }
  return line.some((_, i, arr) => {
    const newLine = [...arr]
    newLine.splice(i, 1)
    return isSafe(newLine)
  })
}

const part2 = (path: string): string | number =>
  inputHandler
    .toArray(path)
    .map(line => line.split(WORD).map(Number))
    .filter(isSafeTwo).length

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 2)
bench(logger, 'part 1 input', () => part1(INPUT), 282)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 4)
bench(logger, 'part 2 input', () => part2(INPUT), 349)
