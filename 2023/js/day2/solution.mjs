#!/usr/bin/env zx
import 'zx/globals'
import {
  InputHandler,
  example,
  input,
  line as LINE,
  product,
  sum,
  word,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = path =>
  inputHandler
    .toArray(path, LINE)
    .map((line, gameId) => {
      const picks = line
        .split(':')[1]
        .split(/;|,/)
        .map(pick => pick.trim().split(word))
      for (const [n, colour] of picks) {
        switch (colour) {
          case 'red':
            if (n > 12) return 0
            break
          case 'green':
            if (n > 13) return 0
            break
          case 'blue':
            if (n > 14) return 0
            break
        }
      }
      return gameId
    })
    .reduce(sum)

const part2 = path =>
  inputHandler
    .toArray(path, LINE)
    .map(line =>
      line
        .split(':')[1]
        .split(/;|,/)
        .reduce(
          (acc, p) => {
            const [n, c] = p.trim().split(' ')
            switch (c) {
              case 'red':
                if (acc[0] <= +n) acc[0] = +n
                break
              case 'green':
                if (acc[1] <= +n) acc[1] = +n
                break
              case 'blue':
                if (acc[2] <= +n) acc[2] = +n
                break
            }
            return acc
          },
          [0, 0, 0]
        )
        .reduce(product)
    )
    .reduce(sum)

console.time('p1e')
console.log(`part1 -- example: ${JSON.stringify(part1(example))}`)
console.timeEnd('p1e')
console.time('p1')
console.log(`part1 -- input: ${JSON.stringify(part1(input))}`)
console.timeEnd('p1')

console.time('p2e')
console.log(`part2 -- example: ${JSON.stringify(part2(example))}`)
console.timeEnd('p2e')
console.time('p2')
console.log(`part2 -- input: ${JSON.stringify(part2(input))}`)
console.timeEnd('p2')
