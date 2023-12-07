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
  numSort,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()

const part1 = (path: string): string | number => {
  const getPrimary = (cards: number[]): number => {
    const [a, b, c, d, e] = [...cards].sort(numSort)
    if (a === e) return 6
    if (a === d || b === e) return 5
    if ((a === c && d === e) || (c === e && a === b)) return 4
    if (a === c || b === d || c === e) return 3
    if ((b === c && d === e) || (a === b && (c === d || d === e))) return 2
    return a === b || b === c || c === d || d === e ? 1 : 0
  }

  return inputHandler
    .toArray(path, LINE)
    .map(l => l.split(' '))
    .map(
      l =>
        [
          l[0]
            .split('')
            .map(c =>
              c < 10
                ? c
                : c
                    .replace('T', '10')
                    .replace('J', '11')
                    .replace('Q', '12')
                    .replace('K', '13')
                    .replace('A', '14')
            )
            .map(Number),
          Number(l[1]),
        ] as [number[], number]
    )
    .map(cards => cards.concat(getPrimary(cards[0])) as [number[], number, number])
    .sort((x, y): number => {
      if (x[2] === y[2]) {
        for (let i = 0; i < 5; i++) {
          const a = x[0][i]
          const b = y[0][i]
          if (a - b) return a - b
        }
      }
      return x[2] - y[2]
    })
    .reduce((s, cards, i) => s + (i + 1) * cards[1], 0)
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

  return inputHandler
    .toArray(path, LINE)
    .map(l => l.split(' '))
    .map(
      l =>
        [
          l[0]
            .split('')
            .map(c =>
              c < 10
                ? c
                : c
                    .replace('T', '10')
                    .replace('J', '0')
                    .replace('Q', '12')
                    .replace('K', '13')
                    .replace('A', '14')
            )
            .map(Number),
          Number(l[1]),
        ] as [number[], number]
    )
    .map(cards => cards.concat(getPrimary(cards[0])) as [number[], number, number])
    .sort((x, y): number => {
      if (x[2] === y[2]) {
        for (let i = 0; i < 5; i++) {
          const a = x[0][i]
          const b = y[0][i]
          if (a - b) return a - b
        }
      }
      return x[2] - y[2]
    })
    .reduce((s, cards, i) => s + (i + 1) * cards[1], 0)
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
