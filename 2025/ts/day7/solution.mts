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
  const startLine = lines.shift()
  const start = startLine?.indexOf('S')

  if (!start) {
    throw new Error('No start found')
  }

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

  const splittersByLine = lines
    .filter(line => line.includes('^'))
    .map(line => [...line.matchAll(new RegExp('\\^', 'g')).map(a => a.index!)])

  class Solver {
    @Memoize({ hashFunction: true })
    solve(beam: number, line: number): number {
      if (line >= splittersByLine.length) {
        return 1
      }
      const nextLine = line + 1

      const splitters = splittersByLine[line]
      if (!splitters.includes(beam)) {
        return this.solve(beam, nextLine)
      }
      return this.solve(beam - 1, nextLine) + this.solve(beam + 1, nextLine)
    }
  }
  return new Solver().solve(start!, 0)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 21)
bench(logger, 'part 1 input', () => part1(INPUT), 1518)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 40)
bench(logger, 'part 2 input', () => part2(INPUT), 25_489_586_715_621)
