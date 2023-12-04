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

const part1 = (path: string): string | number =>
  inputHandler.toArray(path, LINE).reduce((s, c) => {
    const m = [...c.split(':')[1].matchAll(/\s(\d+)(?=\s(\s|\d)*\|(\s|\d)*\s\1(\s|$))/g)].length
    return s + (m ? 2 ** (m - 1) : 0)
  }, 0)

const part2 = (path: string): string | number => {
  return inputHandler
    .toArray(path, LINE)
    .reduce(
      (scores, card) => {
        const [left, right] = card.split(':')[1].split('|')
        const l = [...left.matchAll(/\d+/g)].map(x => Number(x[0]))
        scores.push([1, [...right.matchAll(/\d+/g)].filter(x => l.includes(Number(x[0]))).length])
        return scores
      },
      [[0, 0]] as [number, number][]
    )
    .map(([count, matches], card, scores) => {
      if (matches) range(card + 1, card + matches).forEach(x => (scores[x][0] += count))
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
