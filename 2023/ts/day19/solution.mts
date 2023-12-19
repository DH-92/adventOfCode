#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  getGrid,
  numSort,
  numSortR,
  PARAGRAPH,
  LINE,
  sum,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const doR = ({ op, key, val, ans }, part) => {
  if (op === 0) return ans
  if (op === 1 ? part[key] < val : part[key] > val) return ans
}

const doF = (WFS, flow, part) => {
  const rules = WFS[flow]
  for (const rule of rules) {
    const ret = doR(rule, part)
    if (!ret) continue
    if (ret === 'R') return 0
    if (ret === 'A') return part.x + part.m + part.a + part.s
    return doF(WFS, ret, part)
  }
}

const part1 = (path: string): string | number => {
  const [rawWFS, parts] = inputHandler.toArray(path, PARAGRAPH).map(p => p.split(LINE))
  const WFS = rawWFS.reduce((wfs, wf) => {
    const [name, ...ruleBlock] = wf.split(/\{|\}|,/)
    const rules = ruleBlock.map(rule => {
      if (rule.indexOf(':') === -1) return { ans: rule, op: 0 }
      const [test, ans] = rule.split(':')
      const op = test.match(/<|>/)![0]
      const [key, val] = test.split(/<|>/)
      return { key, val, op: op === '<' ? 1 : 2, ans }
    })
    wfs[name] = rules
    return wfs
  }, {})

  return parts
    .map(part => JSON.parse(part.replace(/(\w+)=([\d]+)/g, '"$1":$2')))
    .map(part => doF(WFS, 'in', part))
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const WFS = inputHandler
    .toArray(path, PARAGRAPH)[0]
    .split(/\n/)
    .reduce((wfs, wf) => {
      const [name, ...ruleBlock] = wf.split(/\{|\}|,/)
      const rules = ruleBlock.map(rule => {
        if (rule.indexOf(':') === -1) return { ans: rule, op: 0 }
        const [test, ans] = rule.split(':')
        const op = test.match(/<|>/)![0]
        const [key, val] = test.split(op)
        return { key, val, op: op === '<' ? 1 : 2, ans }
      })
      wfs[name] = rules
      return wfs
    }, {})

  console.log(WFS)
  const doR = (rule, part) => {
    if (!rule.op) return rule.ans
    if (
      rule.op === '<' //force multi-line
        ? part[rule.key] < rule.val
        : part[rule.key] > rule.val
    )
      return rule.ans
  }

  const doF = (flow, part) => {
    const rules = WFS[flow]
    for (const rule of rules) {
      const ret = doR(rule, part)
      if (!ret) continue
      if (ret === 'R') return 0
      if (ret === 'A') return part.x + part.m + part.a + part.s
      return doF(ret, part)
    }
  }
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 19114)
  bench(logger, 'part 1 input', () => part1(INPUT), 389114)
  // bench(logger, 'part 2 example', () => part2(EXAMPLE), 167409079868000)
  // bench(logger, 'part 2 input', () => part2(INPUT), 52885384955882)
} catch (e) {
  console.error(e)
}
