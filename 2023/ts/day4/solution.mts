#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  LINE,
  sum,
  bench,
  Logger,
  range,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const matches = (card: string): number => {
  const [left, right] = card.split(':')[1].split('|')
  const l = [...left.matchAll(/\d+/g)].map(x => Number(x[0]))
  return [...right.matchAll(/\d+/g)].filter(x => l.includes(Number(x[0]))).length
}

// const matches = (card: string): number =>
//   [...card.split(':')[1].matchAll(/ (\d+)(?= ( |\d)*\|( |\d)* \1( |$))/g)].length

const part1 = (path: string): string | number =>
  inputHandler.toArray(path, LINE).reduce((sum, card) => {
    const m = matches(card)
    return sum + (m ? 2 ** (m - 1) : 0)
  }, 0)

const part2 = (path: string): string | number =>
  inputHandler
    .toArray(path, LINE)
    .reduce((cards, card, i) => {
      const m = matches(card)
      const count = (cards[i] += 1)
      range(1, m).forEach(x => (cards[x + i] += count))
      return cards
    }, new Array(220).fill(0))
    .reduce(sum)

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 13)
  bench(logger, 'part 1 input', () => part1(INPUT), 32609)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 30)
  bench(logger, 'part 2 input', () => part2(INPUT), 14624680)
} catch (e) {
  console.error(e)
}
