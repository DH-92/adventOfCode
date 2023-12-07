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
      // console.log(cards[c], cards[c + 1], 'match')
      pairs++
      c++
    } //else console.log(cards[c], cards[c + 1], 'no match')
  }
  return pairs
}

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE).map(l => l.split(' '))

  const getPrimary = cards => {
    let score
    if (isFiveKind(cards)) {
      score = 6
      console.log('five of a kind', score)
    } else if (isFourKind(cards)) {
      score = 5
      console.log('four of a kind', score)
    } else if (isThreeKind(cards)) {
      if (isFullHouse(cards)) {
        score = 4
        console.log('full house', score)
      } else {
        score = 3
        console.log('three of a kind', score)
      }
    } else {
      score = countPairs(cards)
      console.log('found pairs', score)
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

  const secInner = cards => cards.reduce((s, c, i) => s + c * 15 ** (4 - i), 0)
  const getSecondary = (i: number) => {
    // console.log('getting secondary', i, hands[i])
    const sec = hands[i].reduce((s, c, i) => s + c * 15 ** (4 - i), 0)
    // console.log('getting secondary', i, hands[i], sec)
    return sec
  }

  const hands2 = hands
    .map(h => [...h].sort(numSort))
    .map((cards, i) => [
      getPrimary(cards),
      getSecondary(i),
      lines[i][1],
      lines[i][0],
      hands[i],
      // cards,
      i,
    ])
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]))

  console.log(secInner([10, 10, 11, 11, 13]))
  console.log(secInner([6, 7, 7, 13, 13]))
  // console.log(hands[1], hands2[1])

  return hands2.reduce((s, hand, i) => {
    const score = (i + 1) * hand[2]
    console.log(i + 1, hand[2], hand)
    return s + score
  }, 0)
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE).map(l => l.split(' '))

  const getPrimary = cards => {
    let score
    if (isFiveKind(cards)) {
      score = 6
      console.log('five of a kind', score)
    } else if (isFourKind(cards)) {
      score = 5
      console.log('four of a kind', score)
    } else if (isThreeKind(cards)) {
      if (isFullHouse(cards)) {
        score = 4
        console.log('full house', score)
      } else {
        score = 3
        console.log('three of a kind', score)
      }
    } else {
      score = countPairs(cards)
      console.log('found pairs', score)
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

  const secInner = cards => cards.reduce((s, c, i) => s + c * 15 ** (4 - i), 0)
  const getSecondary = (i: number) => {
    // console.log('getting secondary', i, hands[i])
    const sec = hands[i].reduce((s, c, i) => s + c * 15 ** (4 - i), 0)
    // console.log('getting secondary', i, hands[i], sec)
    return sec
  }

  const hands2 = hands
    .map(h => [...h].sort(numSort))
    .map((cards, i) => [
      getPrimary(cards),
      getSecondary(i),
      lines[i][1],
      lines[i][0],
      hands[i],
      // cards,
      i,
    ])
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]))

  console.log(secInner([10, 10, 11, 11, 13]))
  console.log(secInner([6, 7, 7, 13, 13]))
  // console.log(hands[1], hands2[1])

  return hands2.reduce((s, hand, i) => {
    const score = (i + 1) * hand[2]
    console.log(i + 1, hand[2], hand)
    return s + score
  }, 0)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 6440)
  bench(logger, 'part 1 input', () => part1(INPUT), 250946742)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 0)
  bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {
  console.log(e)
}
