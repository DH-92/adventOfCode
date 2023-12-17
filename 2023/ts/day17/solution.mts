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
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

class Node {
  x: number
  y: number
  val: number
  neighbours: Record<string, Node>
  constructor(y, x, val) {
    this.x = x
    this.y = y
    this.val = val
    this.neighbours = {}
  }
}

const part1 = (path: string): string | number => {
  const grid = inputHandler.toArray(path).map(l => l.split('').map(Number))

  // const nodes = inputHandler
  //   .toArray(path)
  //   .map((l, y) => l.split('').map((c, x) => new Node(y, x, parseInt(c))))

  // const nUp: Node[] = []
  // nodes.forEach((l, y) => {
  //   let nLeft
  //   l.forEach((node, x) => {
  //     if (node) {
  //       if (nLeft) {
  //         node.neighbours[0] = nLeft
  //         node.neighbours[0].neighbours[1] = node
  //       }
  //       nLeft = node
  //       if (nUp[x]) {
  //         node.neighbours[2] = nUp[x]
  //         node.neighbours[2].neighbours[3] = node
  //       }
  //       nUp[x] = node
  //     }
  //   })
  // })

  // const h = 12
  const h = Math.min(grid.length - 1, 999)
  const candidatesDP = getGrid(() => getGrid(() => 900000000, 4, 3), h + 1, h + 1)
  let worstPath = Math.min(h * 18, 9999)

  const DP = getGrid(() => getGrid(() => [], 4, 3), h + 1, h + 1)
  const solve = (x, y, dir, straight, heatLoss: number) => {
    if (x < 0) {
      return 900900111
    } else if (y < 0) {
      return 900900222
    } else if (x > h) {
      return 900900333
    } else if (y > h) {
      return 900900444
    }
    // const newStory = story + `\n${x},${y}\t${dir}\t${straight}\t${heatLoss}`
    const newHeatLoss = heatLoss + grid[y][x]
    if (newHeatLoss >= worstPath) return 900200200
    if (candidatesDP[y][x][dir][straight] < newHeatLoss)
      return 900500500 + candidatesDP[y][x][dir][straight]

    for (let i = straight; i <= 2; i++) {
      candidatesDP[y][x][dir][i] = newHeatLoss
    }

    for (let i = straight + 1; i <= 2; i++) {
      if (dir === 0 || dir === 1) {
        candidatesDP[y][x][2][i] = newHeatLoss
        candidatesDP[y][x][3][i] = newHeatLoss
      } else {
        candidatesDP[y][x][0][i] = newHeatLoss
        candidatesDP[y][x][1][i] = newHeatLoss
      }
    }

    if (x === h && y === h) {
      console.log('got to finish', newHeatLoss)
      worstPath = newHeatLoss
      return grid[y][x]
    }

    if (DP[y][x][dir][straight][newHeatLoss] !== undefined) {
      return DP[y][x][dir][straight][newHeatLoss]
    }
    const candidates = []
    if (straight < 2) candidates.push(dir)
    if (dir === 0 || dir === 1) candidates.push(3, 2)
    if (dir === 2 || dir === 3) candidates.push(1, 0)

    const ans = candidates
      .map(newDir => {
        const newCount = newDir === dir ? straight + 1 : 0
        let newX
        let newY
        if (newDir === 0) {
          newY = y
          newX = x - 1
        } else if (newDir === 1) {
          newY = y
          newX = x + 1
        } else if (newDir === 2) {
          newX = x
          newY = y - 1
        } else if (newDir === 3) {
          newX = x
          newY = y + 1
        }
        return solve(newX, newY, newDir, newCount, newHeatLoss)
      })
      .sort(numSort)[0]

    const result = ans + grid[y][x]
    DP[y][x][dir][straight][newHeatLoss] = result
    return result
  }
  return solve(0, 0, 3, 0, -grid[0][0]) - grid[0][0]
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 102)
  bench(logger, 'part 1 input', () => part1('example2.txt'), 55)
  bench(logger, 'part 1 input', () => part1('example3.txt'), 104)
  bench(logger, 'part 1 input', () => part1('example4.txt'), 337)
  // bench(logger, 'part 1 input', () => part1('input2.txt'), 1008)
  bench(logger, 'part 1 input', () => part1(INPUT), 913)
  // bench(logger, 'part 2 example', () => part2(EXAMPLE), 51)
  // bench(logger, 'part 2 input', () => part2(INPUT), 8221)
} catch (e) {
  console.error(e)
}
