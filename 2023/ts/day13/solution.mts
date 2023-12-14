#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  sum,
  PARAGRAPH,
  transpose,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number =>
  inputHandler
    .toArray(path, PARAGRAPH)
    .map(group => {
      const rows = group.split(/\n/)
      const cols = transpose(rows.map(l => l.split(''))).map(l => l.join(''))
      for (const [dirIdx, lines] of [cols, rows].entries()) {
        i: for (let i = 0; i < lines.length - 1; i++) {
          for (let j = 0; j <= i; j++) {
            const a = lines[i - j]
            const b = lines[i + 1 + j]
            if (b === undefined) break
            if (a !== b) continue i
          }
          return (1 + i) * (dirIdx ? 100 : 1)
        }
      }
    })
    .reduce(sum)!

const part2 = (path: string): string | number =>
  inputHandler
    .toArray(path, PARAGRAPH)
    .map(group => {
      const rows = group.split(/\n/)
      const cols = transpose(rows.map(l => l.split(''))).map(l => l.join(''))
      for (const [lines, multi] of [
        [cols, 1],
        [rows, 100],
      ]) {
        i: for (let i = 0; i < lines.length; i++) {
          let smudges = false
          for (let j = 0; j <= i; j++) {
            const a = lines[i - j]
            const b = lines[i + 1 + j]
            if (b === undefined) break
            const diffs = [...a].reduce((s, c, ci) => (s += c !== b[ci] ? 1 : 0), 0)
            if (diffs > 1) continue i
            if (diffs) {
              if (smudges) continue i
              smudges = true
            }
          }
          if (smudges) return (1 + i) * multi
        }
      }
    })
    .reduce(sum)!

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 405)
  bench(logger, 'part 1 input', () => part1(INPUT), 33047)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 400)
  bench(logger, 'part 2 input', () => part2(INPUT), 28806)
} catch (e) {
  console.error(e)
}
