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
  const isFiveKind = (cards: number[]): boolean => cards[0] === cards[4]
  const isFourKind = (cards: number[]): boolean => cards[0] === cards[3] || cards[1] === cards[4]
  const isThreeKind = (cards: number[]): boolean =>
    cards[0] === cards[2] || cards[1] === cards[3] || cards[2] === cards[4]
  const isFullHouse = (cards: number[]): boolean => {
    if (cards[0] === cards[2] && cards[3] === cards[4]) {
      return true
    } else if (cards[2] === cards[4] && cards[0] === cards[1]) {
      return true
    }
    return false
  }

  const countPairs = (cards: number[]): number => {
    let pairs = 0
    for (let c = 0; c < cards.length - 1; c++) {
      if (cards[c] === cards[c + 1]) {
        pairs++
        c++
      }
    }
    return pairs
  }
  const lines = inputHandler.toArray(path, LINE).map(l => l.split(' '))

  const getPrimary = cards => {
    let score
    if (isFiveKind(cards)) {
      score = 6
    } else if (isFourKind(cards)) {
      score = 5
    } else if (isThreeKind(cards)) {
      if (isFullHouse(cards)) {
        score = 4
      } else {
        score = 3
      }
    } else {
      score = countPairs(cards)
    }
    return score
  }
  const hands = lines.map(l =>
    l[0]
      .split('')
      .map(c =>
        Number(
          c
            .replace('T', '10')
            .replace('J', '11')
            .replace('Q', '12')
            .replace('K', '13')
            .replace('A', '14')
        )
      )
  )

  const getSecondary = (i: number) => {
    const sec = hands[i].reduce((s, c, i) => s + c * 15 ** (4 - i), 0)
    return sec
  }

  const hands2 = hands
    .map(h => [...h].sort(numSort))
    .map((cards, i) => [getPrimary(cards), getSecondary(i), lines[i][1], lines[i][0], hands[i], i])
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]))

  return hands2.reduce((s, hand, i) => {
    const score = (i + 1) * hand[2]
    return s + score
  }, 0)
}

const part2 = (path: string): string | number => {
  const isFiveKind = (cards: number[]): boolean => {
    if (cards[0]) return cards[0] === cards[4]
    if (cards[1]) return cards[1] === cards[4]
    if (cards[2]) return cards[2] === cards[4]
    return !cards[3] || cards[3] === cards[4]
  }
  const isFourKind = (cards: number[]): boolean => {
    if (cards[0]) return cards[0] === cards[3] || cards[1] === cards[4]
    if (cards[1]) return cards[1] === cards[3] || cards[2] === cards[4]
    if (cards[2]) return cards[2] === cards[3] || cards[3] === cards[4]
    return !!cards[3]
  }
  const isThreeKind = (cards: number[]): boolean => {
    if (cards[0]) return cards[0] === cards[2] || cards[1] === cards[3] || cards[2] === cards[4]
    if (cards[1]) return cards[1] === cards[2] || cards[2] === cards[3] || cards[3] === cards[4]
    return !!cards[2]
  }
  const isFullHouse = (cards: number[]): boolean => {
    if (cards[0])
      return (
        (cards[0] === cards[2] && cards[3] === cards[4]) ||
        (cards[2] === cards[4] && cards[0] === cards[1])
      )
    if (cards[1]) return cards[1] === cards[2] && cards[3] === cards[4]
    return !cards[2] || cards[2] === cards[3] || cards[3] === cards[4]
  }

  const countPairs = (cards: number[]): number => {
    if (cards[0] === 0) return 1
    let pairs = 0
    for (let c = 0; c < cards.length - 1; c++) {
      if (cards[c] === cards[c + 1]) {
        pairs++
        c++
      }
    }
    return pairs
  }

  const getPrimary = hand => {
    const cards = [...hand].sort(numSort)
    if (isFiveKind(cards)) return 6
    if (isFourKind(cards)) return 5
    if (isThreeKind(cards)) return isFullHouse(cards) ? 4 : 3
    return countPairs(cards)
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
