#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  bench,
  EXAMPLE,
  INPUT,
  LINE,
  Logger,
  range,
  sum,
  product,
  getGrid,
  numSort,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const getPrimary = cards => {
    const [a, b, c, d, e] = [...cards].sort(numSort)
    if (a === e) return 6
    if (a === d || b === e) return 5
    if ((a === c && d === e) || (c === e && a === b)) return 4
    if (a === c || b === d || c === e) return 3
    if ((b === c && d === e) || (a === b && (c === d || d === e))) return 2
    return a === b || b === c || c === d || d === e ? 1 : 0
  }

  const getSecondary = cards => cards.reduce((s, c, i) => s + c * 15 ** (4 - i), 0)

  const lines = inputHandler.toArray(path, LINE).map(l => l.split(' '))

  return lines
    .map(l => [
      l[0]
        .split('')
        .map(c =>
          Number(
            c < 10
              ? c
              : c
                  .replace('T', '10')
                  .replace('J', '11')
                  .replace('Q', '12')
                  .replace('K', '13')
                  .replace('A', '14')
          )
        ),
      l[1],
    ])
    .map((cards, i) => [getPrimary(cards[0]), getSecondary(cards[0]), cards[1]])
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]))
    .reduce((s, [, , bet], i) => s + (i + 1) * bet, 0)
}

const part2 = (path: string): string | number => {
  const getPrimary = hand => {
    const [a, b, c, d, e] = [...hand].sort(numSort)
    if (a !== 0) {
      if (a === e) return 6
      if (a === d || b === e) return 5
      if ((a === c && d === e) || (c === e && a === b)) return 4
      if (a === c || b === d || c === e) return 3
      if ((b === c && d === e) || (a === b && (c === d || d === e))) return 2
      return a === b || b === c || c === d || d === e ? 1 : 0
    }
    if (b !== 0) {
      if (b === e) return 6
      if (b === d || c === e) return 5
      if (b === c && d === e) return 4
      return b === c || c === d || d === e ? 3 : 1
    }
    if (c !== 0) {
      if (c === e) return 6
      return c === d || d === e ? 5 : 3
    }
    return d === 0 || d === e ? 6 : 5
  }

  const getSecondary = cards => cards.reduce((s, c, i) => s + c * 15 ** (4 - i), 0)

  const lines = inputHandler.toArray(path, LINE).map(l => l.split(' '))

  return lines
    .map(l =>
      l[0]
        .split('')
        .map(c =>
          Number(
            c < 10
              ? c
              : c
                  .replace('T', '10')
                  .replace('J', '0')
                  .replace('Q', '12')
                  .replace('K', '13')
                  .replace('A', '14')
          )
        )
    )
    .map((cards, i) => [getPrimary(cards), getSecondary(cards), lines[i][1]])
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]))
    .reduce((s, [, , bet], i) => s + (i + 1) * bet, 0)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 6440)
  bench(logger, 'part 1 input', () => part1(INPUT), 250946742)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 5905)
  bench(logger, 'part 2 input', () => part2(INPUT), 251824095)
} catch (e) {
  console.log(e)
}
