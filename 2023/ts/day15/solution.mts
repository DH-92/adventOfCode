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
} from '../helpers/index.mjs'

const IH = new InputHandler(process.cwd())

const logger = new Logger()

const hash = (s: string) => [...s].reduce((v, c) => (v = ((v + c.charCodeAt(0)) * 17) % 256), 0)

const part1 = (path: string): number => IH.toArray(path, ',').map(hash).reduce(sum)

const part2 = (path: string): number =>
  IH.toArray(path, ',')
    .map(i => i.split(/=|-/))
    .map(i => [hash(i[0]), Number(i[1]), i[0]] as [number, number, string])
    .reduce(
      (boxes, [boxId, lens, label]) => {
        lens ? boxes[boxId].set(label, lens) : boxes[boxId].delete(label)
        return boxes
      },
      new Array(256).fill(0).map(_ => new Map())
    )
    .flatMap((b, i) => [...b.values()].map((f, s) => (1 + i) * (1 + s) * f))
    .reduce(sum)

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 1320)
  bench(logger, 'part 1 input', () => part1(INPUT), 518107)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 145)
  bench(logger, 'part 2 input', () => part2(INPUT), 303404)
} catch (e) {
  console.error(e)
}
