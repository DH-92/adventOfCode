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
const log = logger.log

const hash = (s: string): number =>
  [...s].reduce((v, c) => (v = ((v + c.charCodeAt(0)) * 17) % 256), 0)

const part1 = (path: string): string | number => IH.toArray(path, ',').map(hash).reduce(sum)

const part2 = (path: string): string | number => {
  const boxes: Map<string, number>[] = new Array(256).fill(0).map(_ => new Map())

  IH.toArray(path, ',')
    .map(i => i.split(/=|-/))
    .map(i => [boxes[hash(i[0])], Number(i[1]), i[0]] as [Map<string, number>, number, string])
    .forEach(([box, lens, label]) => (lens ? box.set(label, lens) : box.delete(label)))

  return boxes.flatMap((b, i) => [...b].map(([_, f], s) => (1 + i) * (1 + s) * f)).reduce(sum)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 1320)
  bench(logger, 'part 1 input', () => part1(INPUT), 518107)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 145)
  bench(logger, 'part 2 input', () => part2(INPUT), 303404)
} catch (e) {
  console.error(e)
}
