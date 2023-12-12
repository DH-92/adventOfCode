#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  transpose,
  range,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  // const lines = [inputHandler.toArray(path).at(-1)]
  let sum = 0
  lines.forEach(line => {
    const [l, n] = line.split(' ')
    const xx = l.split('')
    const groups = n.split(',').map(Number)
    // console.log(xx, groups)
    // console.log(xx.join(''))
    // console.log(groups)
    const qs = l.split('?').length - 1
    // console.log(qs)
    for (let c = 0; c < 2 ** qs; c++) {
      const xy = [...xx]
      let qq = 0
      for (let i = 0; i < xx.length; i++) {
        if (xx[i] !== '?') {
          xy[i] == xx[i]
          continue
        }
        xy[i] = (c >> qq) % 2 ? '#' : '.'
        qq++
      }
      // console.log(c, xy.join(''))
      const xz = xy
        .join('')
        .split('.')
        .filter(x => x.length)
      // console.log(groups)
      // console.log(xz)
      const test =
        groups.length === xz.length && groups.every((group, i) => group === xz[i]?.length)
      if (test) sum++
      // if (test) console.log('!!!!', xy.join(''))
      // console.log(xz.map(x => x.length))
      // console.log(test)
      // console.log(xz)
      // console.log(xy.join(''))
    }
    console.log(l, sum)
    // process.exit(1)
  })

  // console.log(sum)

  // return sum
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  const grid = lines.map(l => l.split(''))
  const line = lines[0]
  console.log(line)
  return line
}

console.clear()
try {
  // bench(logger, 'part 1 example', () => part1(EXAMPLE), 21)
  bench(logger, 'part 1 input', () => part1(INPUT), 0)
  // bench(logger, 'part 2 example', () => part2(EXAMPLE), 0)
  // bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {
  console.error(e)
}
