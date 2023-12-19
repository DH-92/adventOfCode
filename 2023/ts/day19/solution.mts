#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  PARAGRAPH,
  LINE,
  sum,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()

const part1 = (path: string): string | number => {
  const [rawWFS, parts] = inputHandler.toArray(path, PARAGRAPH).map(p => p.split(LINE))
  const WFS = rawWFS.reduce(
    (wfs, wf) => {
      const [name, ...ruleBlock] = wf.split(/\{|\}|,/)
      const rules = ruleBlock.map(rule => {
        if (rule.indexOf(':') === -1) return { ans: rule }
        const [test, ans] = rule.split(':')
        const op = test.match(/<|>/)![0]
        const [key, val] = test.split(/<|>/)
        return { ans, op: op === '<' ? 1 : 2, key, val: Number(val) }
      })
      wfs[name] = rules
      return wfs
    },
    {} as Record<string, { ans: string; op?: number; key?: string; val?: number }[]>
  )

  const solve = (flow: string, part: { x: number; m: number; a: number; s: number }) => {
    const rules = WFS[flow]
    for (const rule of rules) {
      const ret = !rule.op
        ? rule.ans
        : (rule.op === 1 ? part[rule.key!] < rule.val! : part[rule.key!] > rule.val!)
        ? rule.ans
        : ''
      if (!ret) continue
      if (ret === 'R') return
      if (ret === 'A') return part.x + part.m + part.a + part.s
      return solve(ret, part)
    }
  }

  return parts
    .map(part => JSON.parse(part.replace(/(\w+)=([\d]+)/g, '"$1":$2')))
    .map(part => solve('in', part))
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const WFS = inputHandler
    .toArray(path, PARAGRAPH)[0]
    .split(/\n/)
    .reduce((wfs, wf) => {
      const [name, ...ruleBlock] = wf.split(/\{|\}|,/)
      const rules = ruleBlock.map(rule => {
        const [test, ans] = rule.split(':')
        if (!ans) return { ans: rule }
        const op = test.match(/<|>/)![0]
        const [key, val] = test.split(op)
        return {
          ans,
          op,
          key: Number(key.replace('x', '0').replace('m', '1').replace('a', '2').replace('s', '3')),
          val: Number(val),
        }
      })
      wfs[name] = rules
      return wfs
    }, {})

  const validGroups: number[][] = []
  const solve = (flow: string, state: number[]) => {
    if (flow === 'R') return
    if (flow === 'A') {
      validGroups.push(state)
      return
    }

    const rules = WFS[flow]
    for (const rule of rules) {
      const { key, val, op, ans } = rule
      if (!op) {
        solve(ans, state)
        return
      }
      const newState = [...state]
      if (op === '<') {
        state[key] = Math.max(state[key], val)
        newState[key + 4] = Math.min(newState[key + 4], val - 1)
        solve(ans, newState)
        continue
      }
      state[key + 4] = Math.min(state[key + 4], val)
      newState[key] = Math.max(newState[key], val + 1)
      solve(ans, newState)
    }
  }

  solve('in', [1, 1, 1, 1, 4000, 4000, 4000, 4000])

  return validGroups
    .map(group => {
      const xs = group[4] - group[0] + 1
      const ms = group[5] - group[1] + 1
      const as = group[6] - group[2] + 1
      const ss = group[7] - group[3] + 1
      return xs * ms * as * ss
    })
    .reduce(sum)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 19114)
  bench(logger, 'part 1 input', () => part1(INPUT), 389114)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 167409079868000)
  bench(logger, 'part 2 input', () => part2(INPUT), 125051049836302)
} catch (e) {
  console.error(e)
}
