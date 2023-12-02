#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, EXAMPLE, INPUT, WORD, LINE, product, sum, bench } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

enum Colour {
  red = 'red',
  green = 'green',
  blue = 'blue',
}

const part1 = (path: string): string | number =>
  inputHandler
    .toArray(path, LINE)
    .map((line, gameId) => {
      const picks = line
        .split(':')[1]
        .split(/;|,/)
        .map((pick: string): [number, Colour] => {
          const p = pick.trim().split(WORD)
          return [Number(p[0]), p[1] as Colour]
        })
      for (const [n, colour] of picks) {
        switch (colour) {
          case Colour.red:
            if (n > 12) return 0
            break
          case Colour.green:
            if (n > 13) return 0
            break
          case Colour.blue:
            if (n > 14) return 0
            break
        }
      }
      return gameId + 1
    })
    .reduce(sum)

const part2 = (path: string): string | number =>
  inputHandler
    .toArray(path, LINE)
    .map(line =>
      line
        .split(':')[1]
        .split(/;|,/)
        .reduce(
          (acc, p) => {
            const x = p.trim().split(' ')
            const [n, c] = [Number(x[0]), x[1] as Colour]
            switch (c) {
              case Colour.red:
                if (acc[0] <= n) acc[0] = n
                break
              case Colour.green:
                if (acc[1] <= n) acc[1] = n
                break
              case Colour.blue:
                if (acc[2] <= n) acc[2] = n
                break
            }
            return acc
          },
          [0, 0, 0]
        )
        .reduce(product)
    )
    .reduce(sum)

try {
  bench('part 1 example', () => part1(EXAMPLE), 8)
  bench('part 1 input', () => part1(INPUT), 1867)
  bench('part 2 example', () => part2(EXAMPLE), 2286)
  bench('part 2 input', () => part2(INPUT), 84538)
} catch (e) {
  console.error(e)
}
