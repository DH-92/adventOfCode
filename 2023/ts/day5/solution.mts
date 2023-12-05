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
  PARAGRAPH,
  numSortR,
  numSort,
  reshape,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const paras = inputHandler.toArray(path, PARAGRAPH)
  const seeds = paras[0].split(':')[1].trim().split(' ').map(Number)
  const maps = range(7).map(m => {
    return [
      ,
      ...paras[m]
        .split(LINE)
        .filter(l => l.indexOf('-to-') === -1)
        .map(l => l.split(' ').map(Number)),
    ]
      .reduce(
        (map, l) => {
          const [a, b, c] = l
          map.push({ in1: b, in2: b + c - 1, delta: a - b })
          return map
        },
        [] as { in1; in2; delta }[]
      )
      .sort((a, b) => a.in1 - b.in1)
  })

  const levels = maps
    .map(m => m.sort((a, b) => a.in1 - b.in1))
    .map(m => ({
      min: m[0].in1,
      max: m.at(-1).in2,
      list: m,
    }))

  const get = (level, seed) => {
    if (seed < levels[level].min || seed > levels[level].max) return seed
    for (const m of levels[level].list) {
      if (seed >= m.in1 && seed <= m.in2) {
        return seed + m.delta
      }
    }
    return seed
  }

  return seeds
    .map(seed => get(6, get(5, get(4, get(3, get(2, get(1, get(0, seed))))))))
    .sort(numSort)[0]
}

const part2 = (path: string): string | number => {
  const paras = inputHandler.toArray(path, PARAGRAPH)
  const seeds = paras[0].split(':')[1].trim().split(' ').map(Number)
  const maps = range(7).map(m => {
    return [
      ,
      ...paras[m]
        .split(LINE)
        .filter(l => l.indexOf('-to-') === -1)
        .map(l => l.split(' ').map(Number)),
    ]
      .reduce(
        (map, l) => {
          const [a, b, c] = l
          map.push({ in1: b, in2: b + c - 1, delta: a - b })
          return map
        },
        [] as { in1; in2; delta }[]
      )
      .sort((a, b) => a.in1 - b.in1)
  })

  const levels = maps
    .map(m => m.sort((a, b) => a.in1 - b.in1))
    .map(m => ({
      min: m[0].in1,
      max: m.at(-1).in2,
      list: m,
    }))

  const get = (level, seed) => {
    if (seed < levels[level].min || seed > levels[level].max) return seed
    for (const m of levels[level].list) {
      if (seed >= m.in1 && seed <= m.in2) {
        return seed + m.delta
      }
    }
    return seed
  }

  const pairs = reshape(seeds, 2)
  return pairs
    .map(pair => {
      console.log(pair)
      let min = Number.MAX_SAFE_INTEGER
      for (let seed = pair[0]; seed < pair[0] + pair[1]; seed++) {
        const r = get(6, get(5, get(4, get(3, get(2, get(1, get(0, seed)))))))
        if (r < min) min = r
      }
      return min
    })
    .sort(numSort)[0]
}

// const part2 = (path: string): string | number => {
//   const paras = inputHandler.toArray(path, PARAGRAPH)
//   const seeds = paras[0].split(':')[1].trim().split(' ').map(Number)
//   const maps = range(7).map(m => {
//     return [, ...paras[m].split(LINE).map(l => l.split(' ').map(Number))].reduce(
//       (map, l) => {
//         const [a, b, c] = l
//         map.push({ in1: b, in2: b + c - 1, delta: a - b })
//         return map
//       },
//       [] as { in1; in2; delta }[]
//     )
//   })

//   const get = (map, seed) => {
//     for (const m of maps[map]) if (seed >= m.in1 && seed <= m.in2) return seed + m.delta
//     return seed
//   }

//   const pairs = reshape(seeds, 2)
//   return pairs
//     .map(pair => {
//       console.log(pair)
//       let min = Number.MAX_SAFE_INTEGER
//       for (let seed = pair[0]; seed < pair[0] + pair[1]; seed++) {
//         const r = get(6, get(5, get(4, get(3, get(2, get(1, get(0, seed)))))))
//         if (r < min) min = r
//       }
//       return min
//     })
//     .sort(numSort)[0]
// }

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 35)
  bench(logger, 'part 1 input', () => part1(INPUT), 389056265)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 46)
  bench(logger, 'part 2 input', () => part2(INPUT), 137516820)
  //runtime right after submission 206180.44ms
  //runtime with mins and maxes per map 97201.10ms
} catch (e) {
  console.error(e)
}
