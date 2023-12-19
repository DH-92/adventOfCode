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

  console.log(doF(WFS, 'in', { x: 1, m: 1, a: 1, s: 1350 }))
  process.exit()
  return parts
    .map(part => JSON.parse(part.replace(/(\w+)=([\d]+)/g, '"$1":$2')))
    .map(part => doF(WFS, 'in', part))
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const ruleGraph = []

  const WFS = inputHandler
    .toArray(path, PARAGRAPH)[0]
    .split(/\n/)
    .reduce((wfs, wf) => {
      const [name, ...ruleBlock] = wf.split(/\{|\}|,/)
      const rules = ruleBlock.map(rule => {
        if (rule.indexOf(':') === -1) {
          // console.log('DEFAULT RULE')
          // console.log(rule)
          return { ans: rule, op: 0 }
        }
        const [test, ans] = rule.split(':')
        const op = test.match(/<|>/)![0]
        const [key, val] = test.split(op)
        return { key, val: Number(val), op, ans }
      })
      wfs[name] = rules
      return wfs
    }, {})

  const doR = rule => {
    if (!rule.op) return rule.ans
    if (rule.op === '<') return rule.ans
  }

  const groups = []
  const validGroups = []
  const doF = (flow, group, chain = '') => {
    chain += `, ${flow}`
    // console.log('running flow: ', flow)
    // console.log('with group: ', group)
    if (flow === 'A') {
      // console.log('all of these are valid', group, chain)
      validGroups.push({ chain, ...JSON.parse(JSON.stringify(group)) })
      // console.log(chain)
      return
    }
    if (flow === 'R') {
      // console.log('all of these are INvalid', group)
      // console.log(chain)
      return
    }

    const rules = WFS[flow]
    const currGroup = JSON.parse(JSON.stringify(group))
    for (const rule of rules) {
      // console.log('assessing rule', rule)
      // console.log('against group', currGroup)
      const { key, val, op, ans } = rule
      const newGroup = JSON.parse(JSON.stringify(currGroup))
      if (!op) {
        return doF(ans, newGroup, chain)
      } else if (op === '<') {
        console.log(`did ${key} < ${val}`, currGroup)
        newGroup[key].max = Math.min(newGroup[key].max, val - 1)
        currGroup[key].min = Math.max(currGroup[key].min, val)
        doF(ans, newGroup, chain)
      } else {
        console.log(`did ${key} > ${val}`, currGroup)
        newGroup[key].min = Math.max(newGroup[key].min, val + 1)
        currGroup[key].max = Math.min(currGroup[key].max, val)
        console.log({ newGroup, currGroup })
        doF(ans, newGroup, chain)
      }
    }
  }
  doF('in', {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  })
  // console.log('done')
  // console.log(validGroups)
  let total = 0
  validGroups.forEach(group => {
    console.log(group)
    const xs = group.x.max - group.x.min + 1
    const ms = group.m.max - group.m.min + 1
    const as = group.a.max - group.a.min + 1
    const ss = group.s.max - group.s.min + 1
    console.log(`validXs: ${group.x.min}-${group.x.max}: ${xs}`)
    console.log(`validMs: ${group.m.min}-${group.m.max}: ${ms}`)
    console.log(`validAs: ${group.a.min}-${group.a.max}: ${as}`)
    console.log(`validSs: ${group.s.min}-${group.s.max}: ${ss}`)
    console.log(`total valid: ${xs * ms * as * ss}`)
    total += xs * ms * as * ss
  })
  return total
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 19114)
  bench(logger, 'part 1 input', () => part1(INPUT), 389114)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 167409079868000)
  bench(logger, 'part 2 input', () => part2(INPUT), 52885384955882)
} catch (e) {
  console.error(e)
}
