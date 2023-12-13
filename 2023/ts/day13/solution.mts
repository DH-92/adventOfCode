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

const part1 = (path: string): string | number => {
  const groups = inputHandler.toArray(path, PARAGRAPH)
  return groups
    .map(group => {
      let score = 0
      const rows = group.split(/\n/)
      const cols = transpose(rows.map(l => l.split(''))).map(l => l.join(''))
      for (const [dirIdx, lines] of [rows, cols].entries()) {
        const rowMap = {}
        const mps = []
        lines.forEach((l, i) => {
          rowMap[l] ??= []
          rowMap[l].push(i)
        })

        Object.entries(rowMap).forEach(([k, v]) => {
          console.log(k, v)
          if (v.length > 1) {
            // console.log('found: ', v)
            v.forEach(x => {
              if (v.find(y => y === x + 1)) {
                console.log('found an mp', v)
                mps.push(x)
              }
            })
          }
        })
        mps.forEach(mp => {
          for (let i = mp; i >= 0; i--) {
            const ii = 1 + mp + (mp - i)
            console.log(lines.length)
            console.log(i, lines[i])
            console.log(ii, lines[ii])
            console.log('--')
            if (ii >= lines.length) break
            if (!rowMap[lines[i]].includes(ii)) {
              console.log('no match', lines[i])
              // console.log(rowMap[lines[i]], rowMap[lines[1 + mp + (mp - i)]])
              return
            }
          }
          console.log('FOUND A REAL MIRROR', mp)
          console.log(dirIdx)
          if (dirIdx) {
            score += 1 + mp
          } else {
            score += 100 * (mp + 1)
          }
        })
      }
      console.log('swapping to cols')
      return score
    })
    .reduce(sum)

  //   return group
}

const part2 = (path: string): string | number => {
  const groups = inputHandler.toArray(path, PARAGRAPH)
  return groups
    .map(group => {
      let score = 0
      const rows = group.split(/\n/)
      const cols = transpose(rows.map(l => l.split(''))).map(l => l.join(''))
      for (const [dirIdx, lines] of [rows, cols].entries()) {
        const rowMap = {}
        const mps = []
        lines.forEach((l, i) => {
          rowMap[l] ??= []
          rowMap[l].push(i)
        })

        Object.entries(rowMap).forEach(([k, v]) => {
          console.log(k, v)
          if (v.length > 1) {
            // console.log('found: ', v)
            v.forEach(x => {
              if (v.find(y => y === x + 1)) {
                console.log('found an mp', v)
                mps.push(x)
              }
            })
          }
        })
        mps.forEach(mp => {
          for (let i = mp; i >= 0; i--) {
            const ii = 1 + mp + (mp - i)
            console.log(lines.length)
            console.log(i, lines[i])
            console.log(ii, lines[ii])
            console.log('--')
            if (ii >= lines.length) break
            if (!rowMap[lines[i]].includes(ii)) {
              console.log('no match', lines[i])
              // console.log(rowMap[lines[i]], rowMap[lines[1 + mp + (mp - i)]])
              return
            }
          }
          console.log('FOUND A REAL MIRROR', mp)
          console.log(dirIdx)
          if (dirIdx) {
            score += 1 + mp
          } else {
            score += 100 * (mp + 1)
          }
        })
      }
      console.log('swapping to cols')
      return score
    })
    .reduce(sum)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 405)
  bench(logger, 'part 1 input', () => part1(INPUT), 33047)
  //   bench(logger, 'part 2 example', () => part2(EXAMPLE), 0)
  //   bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {
  console.error(e)
}
