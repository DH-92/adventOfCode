#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  LINE,
  transpose,
  PARAGRAPH,
  sum,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  let count = 0
  const lines = inputHandler.toArray(path)
  // const ll = inputHandler.toArray(path)
  // const lines = [ll[1]]
  lines.forEach(line => {
    const [tar, vals] = line.split(':')
    const final = Number(tar)
    const values = vals.match(/\d+/g)?.map(Number) ?? []
    // console.log(final, values)
    const calc = (target: number, vals: number[], total?: number): number | void => {
      // console.log({ target, vals, total })
      const [a, ...r] = vals
      const add = a + (total ?? 0)
      const mul = a * (total ?? 1)
      if (r.length === 0) {
        // console.log({ add, mul, target })
        if (add === target) {
          // console.log('add === target')
          return add
        }
        if (mul === target) {
          // console.log('mul === target')
          return mul
        }
        // console.log('fail')
        return
      }
      // console.log({ add, mul, target, r })
      if (add <= target) {
        const addRes = calc(target, r, add)
        // console.log({ addRes, target, add })
        if (addRes === target) return addRes
      }
      if (mul <= target) {
        const mulres = calc(target, r, mul)
        // console.log({ mulres, target, mul })
        if (mulres === target) return mulres
      }
      // console.log('fail 2')
      return
    }
    const res = calc(final, values)
    // console.log({ target: final, values, res })
    if (res === final) {
      count += final
    }
  })

  return count
}

const part2 = (path: string): string | number => {
  const operations = [
    (a: number, b?: number) => a + (b ?? 0),
    (a: number, b?: number) => a * (b ?? 1),
    (a: number, b?: number) => Number(`${a}${b ?? ''}`),
  ]
  const calc = (target: number, vals: number[], total?: number): number | void => {
    const [a, ...r] = vals
    const add = (total ?? 0) + a
    if (target === add && r.length === 0) return add
    const mul = (total ?? 1) * a
    if (target === mul && r.length === 0) return mul
    const concat = Number(`${total ?? ''}${a}`)
    if (target === concat && r.length === 0) return concat
    if (r.length === 0) return
    if (add <= target) {
      const addRes = calc(target, r, add)
      if (addRes === target) return addRes
    }
    if (mul <= target) {
      const mulres = calc(target, r, mul)
      if (mulres === target) return mulres
    }
    if (concat <= target) {
      const concatRes = calc(target, r, concat)
      if (concatRes === target) return concatRes
    }
  }

  return inputHandler
    .toArray(path)
    .map(line => {
      const [tar, values] = line.split(':').map(x => x.match(/\d+/g)?.map(Number)!)
      const [final] = tar
      const res = calc(final, values)
      return res === final ? final : 0
    })
    .reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 3749)
bench(logger, 'part 1 input', () => part1(INPUT), 1399219271639)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 11387)
bench(logger, 'part 2 input', () => part2(INPUT), 275791737999003)
