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
  PARAGRAPH,
  LINE,
  transpose,
  product,
  reshape,
} from '../helpers/index.mjs'
import { Memoize } from '../helpers/Memoize-decorator.js'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  const start = lines.shift()?.indexOf('S')

  const splittersByLine = lines
    .filter(line => line.includes('^'))
    .map(line => [...line.matchAll('\\^').map(a => a.index!)])

  let beams = new Set<number>([start!])

  let count = 0
  splittersByLine.forEach(splitters => {
    ;[...beams]
      .filter(beam => splitters.includes(beam))
      .forEach(beam => {
        count++
        beams.delete(beam)
        beams.add(beam - 1)
        beams.add(beam + 1)
      })
  })
  return count
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  const start = lines.shift()?.indexOf('S')

  return lines
    .filter(line => line.includes('^'))
    .map(line => [...line.matchAll(new RegExp('\\^', 'g')).map(a => a.index!)])
    .reverse()
    .reduce(
      (traces, splitters) =>
        traces.map((trace, i) => (
          splitters.includes(i) 
            ? traces[i - 1] + traces[i + 1] 
            : trace
        )),
      new Array<number>(lines[0].length).fill(1),
    )[start!]
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 21)
bench(logger, 'part 1 input', () => part1(INPUT), 1518)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 40)
bench(logger, 'part 2 input', () => part2(INPUT), 25_489_586_715_621)
