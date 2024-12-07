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
  getGrid,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

enum DIRS {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
}

const MOVE = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
}

const turn = (dir: DIRS): DIRS => {
  if (dir === DIRS.UP) {
    return DIRS.RIGHT
  } else if (dir === DIRS.RIGHT) {
    return DIRS.DOWN
  } else if (dir === DIRS.DOWN) {
    return DIRS.LEFT
  } else if (dir === DIRS.LEFT) {
    return DIRS.UP
  }
  throw new Error('bad dir')
}

class Node {
  x: number
  y: number
  wall: boolean = false
  constructor({ x, y, wall }: { x: number; y: number; wall: boolean }) {
    this.x = x
    this.y = y
    this.wall = wall
  }
}

class Cursor {
  x: number
  y: number
  dir: DIRS
  grid: Node[][]
  looped: boolean = false
  visited: Set<string> = new Set()

  constructor({ x, y, dir, grid }: { x: number; y: number; dir: DIRS; grid: Node[][] }) {
    this.x = x
    this.y = y
    this.dir = dir
    this.grid = grid
  }

  turn() {
    this.dir = turn(this.dir)
  }

  move() {
    const { dx, dy } = MOVE[this.dir]
    const next = this.grid[this.y + dy]?.[this.x + dx]
    if (!next) {
      return this
    }
    if (next.wall) {
      this.turn()
    }
    if (!next.wall) {
      this.x += dx
      this.y += dy
      if (this.visited.has(`${this.x},${this.y},${this.dir}`)) {
        this.looped = true
        return this
      }
      this.visited.add(`${this.x},${this.y},${this.dir}`)
    }
    this.move()
    return this
  }
}

const buildGrid = (lines: string[]): Cursor => {
  const grid: Node[][] = getGrid(() => ({}) as Node, lines.length, lines[0].length)
  let cursor: Cursor
  lines.forEach((l, y) => {
    l.split('').forEach((c, x) => {
      const node = (grid[y][x] = new Node({ x, y, wall: false }))
      switch (c) {
        case '#':
          node.wall = true
          break
        case '^':
          cursor = new Cursor({
            x,
            y,
            dir: DIRS.UP,
            grid,
          })
          break
      }
    })
  })
  if (!cursor!) {
    throw new Error('no cursor')
  }
  return cursor
}

// const part1 = (path: string): string | number => {
//   const [grid, start] = buildGrid(inputHandler.toArray(path))
//   const visited = new Set<string>()
//   while (!start.done) {
//     start.move(grid, visited)
//   }
//   return visited.size
// }

const part2 = (path: string): string | number => {
  const start = buildGrid(inputHandler.toArray(path))

  const { grid, x, y, dir } = start

  const visited = start.move().visited
  const uniqueVisited = Array.from(
    new Set(
      Array.from(visited)
        .map(v => v.split(','))
        .map(([x, y]) => `${x},${y}`),
    ),
  ).map(v => v.split(',').map(Number))

  return uniqueVisited.filter(([x2, y2]) => {
    grid[y2][x2].wall = true
    const cursor = new Cursor({ x, y, dir, grid}).move()
    grid[y2][x2].wall = false
    return cursor.looped
  }).length
}

const logger = new Logger()

// bench(logger, 'part 1 example', () => part1(EXAMPLE), 41)
// bench(logger, 'part 1 input', () => part1(INPUT), 4454) // off by one somewhere... fix later
bench(logger, 'part 2 example', () => part2(EXAMPLE), 6)
bench(logger, 'part 2 input', () => part2(INPUT), 1503)

// console.log('visited', JSON.stringify([...visited].sort()))
// console.log('turns', JSON.stringify([...turns].sort()))
// const loops = new Set<string>()
// const turns = [...start.turns!]
// const visited = start.visited!
// turns.forEach(tt => {
//   const t = tt.split(',')
//   const x1 = +t[0]
//   const y1 = +t[1]
//   const dir = t[2] as DIRS
//   let x = x1
//   let y = y1
//   const rayDir = turn(turn(dir))
//   const loopDir = turn(rayDir)
//   while (true) {
//     const { dx, dy } = MOVE[rayDir]
//     x += dx
//     y += dy
//     if (visited.has(`${x},${y},${loopDir}`)) {
//       // console.log('could be loopy', {x, y}, loopDir, MOVE[loopDir])
//       const { dx: ddx, dy: ddy } = MOVE[loopDir]
//       // console.log({ddx, ddy})
//       const lx = x + ddx
//       const ly = y + ddy
//       if (!grid[ly]?.[lx]?.wall) {
//         loops.add(`${lx},${ly}`)
//       }
//     }
//     const next = grid[y]?.[x]
//     if (!next) {
//       break
//     }
//     if (next.wall) {
//       break
//     }
//   }
// })
// // console.log('loops', loops)
// // console.table((grid.map(l => l.map(n => (n.wall ? '#' : '.')))))
// const trueLoops = [...loops].filter(l => {
//   const [x, y] = l.split(',').map(Number)
//   grid[y][x].wall = true
//   const cursor = new Node()
//   cursor.x = initialX
//   cursor.y = initialY
//   cursor.dir = DIRS.UP
//   cursor.visited = new Set<string>()
//   cursor.turns = new Set<string>()
//   while (!cursor.done) {
//     cursor.move(grid)
//   }
//   grid[y][x].wall = false
//   if (cursor.looped) {
//     return true
//   }
//   return false
// })
