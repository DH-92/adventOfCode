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

const arrayShift = <T,>(array: Array<T>): T | undefined => array[0]

const part1 = (path: string): string | number => {
  const cards = inputHandler.toArray(path, LINE)
  return cards.reduce((sum, card) => {
    const [win, my] = card.split(':')[1].split('|')
    const winners = [...win.matchAll(/\d+/g)].reduce(
      (acc, x) => acc.add(x[0]),
      new Set() as Set<string>
    )
    const m = [...my.matchAll(/\d+/g)].filter(x => winners.has(x[0]))
    return Math.floor((sum += 2 ** (m.length - 1)))
  }, 0)
}

const part2 = (path: string): string | number => {
  const scores = [[0, 0]] as [number, number][] // count of card and matches
  inputHandler.toArray(path, LINE).forEach(card => {
    const [a, b] = card.split(':')[1].split('|')
    const winners = [...a.matchAll(/\d+/g)].reduce(
      (acc, x) => acc.add(Number(x[0])),
      new Set() as Set<number>
    )
    const matches = [...b.matchAll(/\d+/g)].filter(x => winners.has(Number(x[0])))
    scores.push([1, matches.length])
  }, 0)

  return scores
    .map((x, card) => {
      const [count, score] = x
      if (score) range(card + 1, card + score).forEach(x => (scores[x][0] += count))
      return x
    })
    .map(arrayShift)
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
