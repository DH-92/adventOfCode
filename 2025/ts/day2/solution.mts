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
    if (string.length % 2 !== 0) {
      return false
    }

    const half = string.length / 2
    for (let i = 0; i < half; i++) {
      if (string[i] !== string[i + half]) {
        return false
      }
    }
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
  // get divisor that quickly checks for repeated values in numbers
  // e.g. 123123123 has 9 digits with 3 identical chunks each with a length of 3 digits
  // It can be found by checking modulo 1001001 (10^0 + 10^3 + 10^6)
  const getDivisorForChunkPattern = (digits: number, numberOfChunks: number): number => {
    const sizeOfChunks = digits / numberOfChunks
    let modulo = 0
    for (let digit = 0; digit < digits; digit += sizeOfChunks) {
      modulo += 10 ** digit
    }
    return modulo
  }

  const getInterestingDivisorsByDigits = (digits: number): number[] => {
    const divisors: number[] = []

    // find all chunk patterns that fit within the number of digits
    // only need to check prime numbers as patterns made of composites are covered by their prime factors
    for (const numberOfChunks of primes) {
      if (numberOfChunks > digits) break

      // must divide evenly to create chunks
      if (digits % numberOfChunks !== 0) continue

      divisors.push(getDivisorForChunkPattern(digits, numberOfChunks))
    }
    return divisors
  }

  const validateRange = ([start, end]: [number, number]): number[] => {
    const startDigits = Math.ceil(Math.log10(start + 1))
    const endDigits = Math.ceil(Math.log10(end + 1))

    // Need to avoid duplicates as some numbers may be divisible by multiple patterns
    // e.g. 222222 is divisible by both 10101 (22 3 times) and 1001 (222 3 times)
    const invalidIds = new Set<number>()

    for (const divisor of getInterestingDivisorsByDigits(startDigits)) {
      // First number >= start that is divisible by divisor
      const firstInvalid = Math.ceil(start / divisor) * divisor

      // Last number with startDigits digits eg. 999 for 3 digits
      const endOfStartDigits = 10 ** startDigits - 1

      const firstRangeEnd = Math.min(end, endOfStartDigits)

      // Add all invalid IDs in range
      for (
        let invalid = firstInvalid;
        invalid <= firstRangeEnd;
        invalid += divisor
      ) {
        invalidIds.add(invalid)
      }
    }

    if (startDigits !== endDigits) {
      for (const divisor of getInterestingDivisorsByDigits(endDigits)) {
        // First number with endDigits digits eg 1000 for 4 digits
        const startOfEndDigits = 10 ** (endDigits - 1)

        // First number >= startOfEndDigits that is divisible by divisor
        const firstInvalid = Math.ceil(startOfEndDigits / divisor) * divisor

        // Add all invalid IDs in range
        for (let invalid = firstInvalid; invalid <= end; invalid += divisor) {
          invalidIds.add(invalid)
        }
      }
    }
    return [...invalidIds]
  }

  return inputHandler
    .toArray(path, ',')
    .map(range => range.split('-').map(Number) as [number, number])
    .flatMap(validateRange)
    .reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 1227775554)
bench(logger, 'part 1 input', () => part1(INPUT), 20223751480)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 4174379265)
bench(logger, 'part 2 input', () => part2(INPUT), 30260171216)

// console.log(primes)
