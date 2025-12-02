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
  const input = inputHandler
    .toString(path)
    .split(',')
    .map(range => range.split('-'))

  let sum = 0
  const isInvalid = (string: string): boolean => {
    // console.log('checking', string)
    if (string.length % 2 !== 0) {
      // console.log('odd length', string)
      return false
    }

    const half = string.length / 2
    for (let i = 0; i < half; i++) {
      if (string[i] !== string[i + half]) {
        // console.log('mismatch', string, string[i], string[i + half])
        return false
      }
    }
    // console.log('is invalid', string)
    sum += Number(string)
    return true
  }

  const ranges = input.map(range => {
    const [start, end] = range.map(Number)
    const ids = []
    for (let i = start; i <= end; i++) {
      ids.push(i.toString())
    }
    return ids
  })

  ranges.flat().forEach(isInvalid)
  return sum
}

const primes = getPrimes()

const part2 = (path: string): string | number => {
  const input = inputHandler
    .toString(path)
    .split(',')
    .map(range => range.split('-').map(Number))

  const moduloCache: number[][] = [[]]
  // getModulo to check for repeated values in numeric strings
  // e.g. 123123123 with partialCount 3 and partialLength 3
  // needs to check modulo 1001001 (10^0 + 10^3 + 10^6)
  const getModulo = (partialCount: number, partialDigits: number): number => {
    if (moduloCache[partialCount]?.[partialDigits]) {
      return moduloCache[partialCount][partialDigits]
    }
    let modulo = 0
    for (let i = 0; i < partialCount; i++) {
      modulo += 10 ** (i * partialDigits)
    }
    moduloCache[partialCount] ??= []
    return (moduloCache[partialCount][partialDigits] = modulo)
  }

  const isInvalid = (id: number): boolean => {
    for (const partialCount of primes) {
      const digits = Math.ceil(Math.log10(id+1))
      if (partialCount > digits) {
        return false
      }
      if (digits % partialCount) {
        continue
      }
      const partialDigits = digits / partialCount
      const modulo = getModulo(partialCount, partialDigits)
      if (id % modulo === 0) {
        return true
      }
    }
    return false
  }

  const ranges = input.map(([start, end]) => range(start, end))

  return ranges.flat().filter(isInvalid).reduce(sum, 0)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 1227775554)
bench(logger, 'part 1 input', () => part1(INPUT), 20223751480)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 4174379265)
bench(logger, 'part 2 input', () => part2(INPUT), 30260171216)

// console.log(primes)
