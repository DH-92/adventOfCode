#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, bench, Logger } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  const dialSize = 100

  interface ParsedLine {
    direction: 'L' | 'R'
    distance: number
  }

  const parseLine = (line: string): ParsedLine => ({
    direction: line.charAt(0) as 'L' | 'R',
    distance: Number(line.slice(1)),
  })

  interface MoveAcc {
    count: number
    position: number
  }

  const move = ({ count, position }: MoveAcc, { direction, distance }: ParsedLine): MoveAcc => {
    const dir = direction === 'L' ? -1 : 1
    position += dir * distance

    position %= dialSize
    if (position < 0) position += dialSize
    if (position === 0) count += 1

    return { position, count }
  }

  return inputHandler.toArray(path).map(parseLine).reduce(move, { position: 50, count: 0 }).count
}

const part2 = (path: string): string | number => {
  const dialSize = 100

  interface ParsedLine {
    direction: 'L' | 'R'
    distance: number
  }

  const parseLine = (line: string): ParsedLine => ({
    direction: line.charAt(0) as 'L' | 'R',
    distance: Number(line.slice(1)),
  })

  interface MoveAcc {
    count: number
    position: number
  }

  const move = ({ count, position }: MoveAcc, { direction, distance }: ParsedLine): MoveAcc => {
    // If last move finished at 0, avoid double counting it
    if (direction === 'L' && position === 0) {
      count -= 1
    }

    const dir = direction === 'L' ? -1 : 1
    position += dir * distance

    if (position <= 0) {
      count += 1
    }

    if (position < 0 || position >= dialSize) {
      count += Math.floor(Math.abs(position / dialSize))
    }
    position %= dialSize
    if (position < 0) position += dialSize

    return { position, count }
  }

  return inputHandler.toArray(path).map(parseLine).reduce(move, { position: 50, count: 0 }).count
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 3)
bench(logger, 'part 1 input', () => part1(INPUT))

bench(logger, 'part 2 example', () => part2(EXAMPLE), 6)

// 2749 is too low
// 7132 is too high
bench(logger, 'part 2 input', () => part2(INPUT), 6671)
