#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, LINE, bench, Logger, sum } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  let position = 50 // starts in the middle

  const countByPosition: Array<number> = Array(100).fill(0)
  const move = (direction: 'L' | 'R', distance: number) => {
    switch (direction) {
      case 'L':
        position -= distance
        break
      case 'R':
        position += distance
        break
    }
    // console.log(`Pre-mod position: ${position}`)
    position = (position + 100) % 100
    countByPosition[position]++
    // console.log(`Moved ${direction}${distance} to position ${position}`)
  }
  const input = inputHandler.toArray(path).map(line => {
    const chars = line.split('')
    const direction = chars[0] as 'L' | 'R'
    const distance = Number(chars.slice(1).join(''))
    return { direction, distance }
  })

  input.forEach(({ direction, distance }) => move(direction, distance))

  return countByPosition[0]
}

const part2 = (path: string): string | number => {
  const dialSize = 100

  const move = (acc, curr) => {
    let { count, position } = acc
    const { direction, distance } = curr
    const dir = direction === 'L' ? -1 : 1

    position = position % dialSize
    // If last move finished at 0, avoid double counting it
    if (dir === -1 && position === 0) position = dialSize

    position += dir * distance

    if (position === 0) {
      count += 1
    } else if (position < 0) {
      count += Math.floor(Math.abs(position / dialSize)) + 1
      position = (position + dialSize * Math.ceil(distance / dialSize)) % dialSize
    } if (position >= dialSize) {
      count += Math.floor(position / dialSize)
    }
    return { position, count }
  }

  const parseLine = (line: string): { direction: 'L' | 'R'; distance: number } => ({
    direction: line[0] as 'L' | 'R',
    distance: Number(line.slice(1)),
  })

  const input = inputHandler.toArray(path).map(parseLine)

  return input.reduce(move, { position: 50, count: 0 }).count
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 3)
bench(logger, 'part 1 input', () => part1(INPUT))

bench(logger, 'part 2 example', () => part2(EXAMPLE), 6)

// 2749 is too low
// 7132 is too high
bench(logger, 'part 2 input', () => part2(INPUT), 6671)
