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

const part1 = (path: string): string | number => {
  const input = inputHandler.toArray(path)

  const bankJoltage = (bank: string): number => {
    for (let i = 9; i >= 0; i--) {
      for (let j = 9; j >= 0; j--) {
        const found = new RegExp(`${i}.*${j}`).test(bank)
        if (found) {
          return Number(`${i}${j}`)
        }
      }
    }
    console.log('no joltage found')
    throw new Error('no joltage found')
  }

  return input.map(bankJoltage).reduce((a, b) => a + b, 0)
}

const part2 = (path: string): string | number => {
  const input = inputHandler.toArray(path)
  const targetLength = 12

  type PositionsByDigit = Record<string, number[]>

  const getPositionsByDigit = (bank: string): PositionsByDigit =>
    bank
      .split('')
      .map(Number)
      .reduce((map: PositionsByDigit, d, i) => {
        ;(map[d] ??= []).push(i)
        return map
      }, {})

  const bankJoltage = (positionsByDigit: PositionsByDigit): number => {
    const bankLength = Math.max(...Object.values(positionsByDigit).flat()) + 1

    const result: string[] = []
    let currentPos = -1

    const digits = Object.entries(positionsByDigit).reverse()
    while (true) {
      // Do not add digits to the result if we wouldn't have enough room left to fill the result
      const highestValidPosition = bankLength + result.length - targetLength

      for (const [digit, positionsOfDigit] of digits) {
        const [nextPos] = positionsOfDigit
          .filter(pos => pos > currentPos)
          .filter(pos => pos <= highestValidPosition)

        if (nextPos === undefined) continue

        result.push(digit)
        // we're done - return the result
        if (result.length === targetLength) return Number(result.join(''))

        currentPos = nextPos
        // look for the next 9, then 8, etc
        break
      }
    }
  }
  return input
    .map(getPositionsByDigit)
    .map(bankJoltage)
    .reduce((a, b) => a + b, 0)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 357)
bench(logger, 'part 1 input', () => part1(INPUT), 17207)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 3121910778619)
bench(logger, 'part 2 input', () => part2(INPUT), 170997883706617)
