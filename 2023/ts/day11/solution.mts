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
  const grid = inputHandler.toArray(path).map(l => l.split(''))
  const nodes = grid.reduce((n, r, y) => {
    r.forEach((c, x) => {
      if (c === '#') n.push({ x, y, xx: x, yy: y })
    })
    return n
  }, [])
  grid.forEach((l, i) => {
    if (l.every(c => c === '.')) {
      nodes.forEach(node => {
        if (node.y > i) node.yy += 1
      })
    }
  })
  transpose(grid).forEach((l, i) => {
    if (l.every(c => c === '.')) {
      nodes.forEach(node => {
        if (node.x > i) node.xx += 1
      })
    }
  })

  let sum = 0
  for (let n = 0; n < nodes.length; n++) {
    for (let nn = n + 1; nn < nodes.length; nn++) {
      const a = nodes[n]
      const b = nodes[nn]
      sum += Math.abs(a.xx - b.xx) + Math.abs(a.yy - b.yy)
    }
  }
  return sum
}

const part2 = (path: string): string | number => {
  const grid = inputHandler.toArray(path).map(l => l.split(''))
  const nodes = grid.reduce((n, r, y) => {
    r.forEach((c, x) => {
      if (c === '#') n.push({ x, y, xx: x, yy: y })
    })
    return n
  }, [])
  grid.forEach((l, i) => {
    if (l.every(c => c === '.')) {
      nodes.forEach(node => {
        if (node.y > i) node.yy += 999999
      })
    }
  })
  transpose(grid).forEach((l, i) => {
    if (l.every(c => c === '.')) {
      nodes.forEach(node => {
        if (node.x > i) node.xx += 999999
      })
    }
  })

  return nodes.reduce((s, n, i) => {
    for (let nn = i + 1; nn < nodes.length; nn++) {
      s += Math.abs(n.xx - nodes[nn].xx) + Math.abs(n.yy - nodes[nn].yy)
    }
    return s
  }, 0)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 374)
  bench(logger, 'part 1 input', () => part1(INPUT), 10292708)
  // bench(logger, 'part 2 example', () => part2(EXAMPLE), 1)
  bench(logger, 'part 2 input', () => part2(INPUT), 790194712336)
} catch (e) {
  console.error(e)
}
