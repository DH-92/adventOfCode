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

  const bankJoltage = (bank: string): number => {
    const digits = bank.split('').map(Number)
    const positionsByDigit = digits
      .reduce((map: Record<number, number[]>, d, i) => {
        ;(map[d] ??= []).push(i)
        return map
      }, {})

    const result: number[] = []
    let currentPos = -1

    while (true) {
      nextVal: for (let i = 9; i >= 0; i--) {
        for (const position of positionsByDigit[i] ?? []) {
          if (currentPos >= position) continue

          const remainingDigits = result.length - targetLength
          if (position > (bank.length + remainingDigits)) continue

          result.push(i)
          if (result.length === targetLength) return Number(result.join(''))

          currentPos = position
          break nextVal
        }
      }
    }
  }
  return input.map(bankJoltage).reduce((a, b) => a + b, 0)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 357)
bench(logger, 'part 1 input', () => part1(INPUT), 17207)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 3121910778619)
bench(logger, 'part 2 input', () => part2(INPUT), 170997883706617)
