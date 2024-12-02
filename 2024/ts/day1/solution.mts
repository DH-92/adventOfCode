#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, LINE, bench, Logger, sum } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  const input = inputHandler.toArray(path)
  const left:Number[] = []
  const right:Number[] = []
  input.forEach((line) => {
    const [l, r] = line.split('   ')
    left.push(Number(l))
    right.push(Number(r))
  })
  const leftSorted: Number[] = left.toSorted((a, b) => a - b)
  const rightSorted: Number[] = right.toSorted((a, b) => a - b)
  const diffs = leftSorted.map((l, i) => Math.abs(rightSorted[i] - l))
  return diffs.reduce(sum)
}

const part2 = (path: string): string | number => {
  const input = inputHandler.toArray(path)
  const left:Number[] = []
  const right:Number[] = []
  input.forEach((line) => {
    const [l, r] = line.split('   ')
    left.push(Number(l))
    right.push(Number(r))
  })
  const scores = left.map((l) => {
    const rCount = right.filter((r) => l === r).length
    const score = l * rCount
    return score
  })
  return scores.reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger,'part 1 example', () => part1(EXAMPLE), 11)
bench(logger, 'part 1 input', () => part1(INPUT), 1651298)

bench(logger, 'part 2 example', () => part2(EXAMPLE), 31)
bench(logger, 'part 2 input', () => part2(INPUT), 21306195)
