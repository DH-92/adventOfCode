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

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  return lines
    .map(line => {
      const [ll, nn] = line.split(/\s+/)
      const dots = ll.split('')
      const groups = nn.split(',').map(Number)

      const DP = {}
      const solve = (pos: number = 0, groupId: number = 0, groupPos: number = 0): number => {
        const key = JSON.stringify({ pos, groupId, groupPos })
        if (DP[key] !== undefined) return DP[key]
        const endOfString = pos === dots.length
        const notInBlock = groupPos === 0
        if (endOfString) {
          const noBlocksRemaining = groupId == groups.length
          // ###.### matches ???.### 3,3
          if (noBlocksRemaining && notInBlock) return 1
          const inLastBlock = groupId == groups.length - 1
          const atEndOfBlock = groups[groupId] == groupPos
          // ###.###. matches ???.###. 3,3
          if (inLastBlock && atEndOfBlock) return 1
          // Could be untouched blocks left
          // eg ###..... fails ???.###. 3,3
          // or or not at end of block so invalid
          // eg ###...## fails ???.###. 3,3
          return 0
        }
        const dot = dots[pos]
        const next = pos + 1
        if (dot === '#') return (DP[key] = solve(next, groupId, groupPos + 1))
        const notLastBlock = groupId < groups.length
        const isEndOfBlock = groups[groupId] == groupPos
        if (dot === '?') {
          // Test adding a '#'
          const ans = solve(next, groupId, groupPos + 1)
          // Test adding a '.'
          if (notInBlock) return (DP[key] = solve(next, groupId) + ans)
          // In a block so only add '.' if at the end of it
          if (notLastBlock && isEndOfBlock) return (DP[key] = solve(next, groupId + 1) + ans)
          // Can't add '.' so return results of only '#'
          return (DP[key] = ans)
        }
        // else dot === "."
        if (notInBlock) return (DP[key] = solve(next, groupId))
        if (notLastBlock && isEndOfBlock) return (DP[key] = solve(next, groupId + 1))
        // We're in a block that we expect to continue so can't add a '.'
        return (DP[key] = 0)
      }
      return solve()
    })
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  return lines
    .map(line => {
      const [ll, nn] = line.split(/\s+/)
      const dots = `${ll}?${ll}?${ll}?${ll}?${ll}`.split('')
      const groups = `${nn},${nn},${nn},${nn},${nn}`.split(',').map(Number)
      const gRemaining = groups.map((_, i) => {
        let sum = 0
        for (let g = i; g < groups.length; g++) sum += groups[g] + 1
        return sum
      })
      gRemaining.push(0)
      const DP = {}
      const solve = (pos: number = 0, groupId: number = 0, groupPos: number = 0): number => {
        const key = JSON.stringify({ pos, groupId, groupPos })
        if (DP[key] !== undefined) return DP[key]
        const remaining = dots.length - pos
        const notInBlock = groupPos === 0
        if (!remaining) {
          const noBlocksRemaining = groupId == groups.length
          // ###.### matches ???.### 3,3
          if (noBlocksRemaining && notInBlock) return 1
          const inLastBlock = groupId == groups.length - 1
          const atEndOfBlock = groups[groupId] == groupPos
          // ###.###. matches ???.###. 3,3
          if (inLastBlock && atEndOfBlock) return 1
          // Could be untouched blocks left
          // eg ###..... fails ???.###. 3,3
          // or or not at end of block so invalid
          // eg ###...## fails ???.###. 3,3
          return 0
        }

        if (remaining < gRemaining[groupId + 1]) return (DP[key] = 0)

        if (!notInBlock) {
          if (groups[groupId] === groupPos) {
            if (dots[pos] === '#') return (DP[key] = 0)
          } else {
            if (dots[pos] === '.') return (DP[key] = 0)
            return (DP[key] = solve(pos + 1, groupId, groupPos + 1))
          }
        }
        const dot = dots[pos]
        if (dot === '#') return (DP[key] = solve(pos + 1, groupId, groupPos + 1))
        let ans = 0
        if (dot === '?') {
          // Test adding a '#'
          ans = solve(pos + 1, groupId, groupPos + 1)
        }
        // Test adding a '.'
        if (notInBlock) return (DP[key] = solve(pos + 1, groupId) + ans)
        if (groups[groupId] == groupPos) return (DP[key] = solve(pos + 1, groupId + 1) + ans)
        return (DP[key] = ans)
      }
      return solve()
    })
    .reduce(sum)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 21)
  bench(logger, 'part 1 input', () => part1(INPUT), 7922)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 525152)
  bench(logger, 'part 2 input', () => part2(INPUT), 18093821750095)
} catch (e) {
  console.error(e)
}
