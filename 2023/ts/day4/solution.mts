#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  LINE,
  product,
  sum,
  bench,
  Logger,
  range,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const cards = inputHandler.toArray(path, LINE)
  return cards.reduce((sum, card) => {
    const [win, my] = card.split(':')[1].split('|')
    const winners = [...win.matchAll(/\d+/g)].reduce(
      (acc, x) => acc.add(x[0]),
      new Set() as Set<string>
    )
    const count = [...my.matchAll(/\d+/g)].filter(x => winners.has(x[0])).length
    return Math.floor((sum += 2 ** (count - 1)))
  }, 0)
}

const part2 = (path: string): string | number => {
  const scores = [[0, 0]] as [number, number][] // count of card and matches
  inputHandler.toArray(path, LINE).forEach(card => {
    const [left, right] = card.split(':')[1].split('|')
    const winners = new Set([...left.matchAll(/\d+/g)].map(x => Number(x[0])))
    scores.push([1, [...right.matchAll(/\d+/g)].filter(x => winners.has(Number(x[0]))).length])
  })

  return scores
    .map(([count, matches], card) => {
      if (matches) range(card + 1, card + matches).forEach(y => (scores[y][0] += count))
      return count
    })
    .reduce(sum)!
}

try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 13)
  bench(logger, 'part 1 input', () => part1(INPUT), 32609)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 30)
  bench(logger, 'part 2 input', () => part2(INPUT), 14624680)
} catch (e) {
  console.error(e)
}
