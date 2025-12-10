#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  WORD,
  bench,
  Logger,
  sum,
  getPrimes,
  range,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const filled = '@'

const part1 = (path: string): string | number => {
  const input = inputHandler
    .toGrid(path)
    .map((row, y) => row.map(cell => (cell === filled ? 1 : 0)))

  let result = 0
  input.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return
      let neighbours = 0
      if (input[y - 1]?.[x - 1]) neighbours++
      if (input[y - 1]?.[x + 0]) neighbours++
      if (input[y - 1]?.[x + 1]) neighbours++
      if (input[y + 0]?.[x - 1]) neighbours++
      // if (input[y + 0]?.[x + 0]) neighbours++
      if (input[y + 0]?.[x + 1]) neighbours++
      if (input[y + 1]?.[x - 1]) neighbours++
      if (input[y + 1]?.[x + 0]) neighbours++
      if (input[y + 1]?.[x + 1]) neighbours++

      if (neighbours < 4) {
        result++
      }
    })
  })
  return result
}

const part2 = (path: string): string | number => {
  const input = inputHandler.toMappedGrid(path, c => (c === filled))

  let result = 0
  let changes = false
  do {
    changes = false
    input.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell) return

        const dirs = [
          [-1, -1], // NW
          [-1, 0], // N
          [-1, 1], // NE
          [0, -1], // W
          //[0, 0],
          [0, 1], // E
          [1, -1], // SW
          [1, 0], // S
          [1, 1], // SE
        ]

        const neighbours = dirs.map(([dx, dy]) => !!input[y + dy]?.[x + dx]).map(Number).reduce(sum)

        if (neighbours < 4) {
          input[y][x] = false
          changes = true
          result++
        }
      })
    })
  } while (changes)

  return result
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 13)
bench(logger, 'part 1 input', () => part1(INPUT), 1474)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 43)
bench(logger, 'part 2 input', () => part2(INPUT), 8910)
