#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, bench, Logger, LINE, transpose } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const diagonalsFromGrid = (grid: string[][]): string[] => {
  const width = grid[0].length
  const height = grid.length
  const diagonals = []
  for (let y = 0 - width; y < height; y++) {
    let diag = ''
    for (let i = 0; i < width; i++) {
      diag += grid[y + i]?.[i] ?? ''
    }
    diagonals.push(diag)
  }

  for (let x = 0; x < height + width; x++) {
    let diag = ''
    for (let i = 0; i < height; i++) {
      diag += grid[i]?.[x - i] ?? ''
    }
    diagonals.push(diag)
  }
  return diagonals
}

const part1 = (path: string): number => {
  const grid: string[][] = inputHandler.toArray(path, LINE).map(l => l.split(''))

  const rows = grid.map(row => row.join(''))
  const cols = transpose(grid).map(col => col.join(''))
  const diagonals = diagonalsFromGrid(grid)

  return [...rows, ...cols, ...diagonals].reduce((sum, row) => {
    sum += row.match(/XMAS/g)?.length ?? 0
    sum += row.match(/SAMX/g)?.length ?? 0
    return sum
  }, 0)
}

const part2 = (path: string): number => {
  const grid: string[][] = inputHandler.toArray(path, LINE).map(l => l.split(''))
  let count = 0
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      // identify the anchor cell
      if (cell !== 'A') {
        return
      }

      /**
       *      S  |      M
       *    A    |    A
       *  M      |  S
       */
      const northEast = grid[y - 1]?.[x + 1]
      const southWest = grid[y + 1]?.[x - 1]
      if (!((northEast === 'M' && southWest === 'S') || (northEast === 'S' && southWest === 'M'))) {
        return // invalid forward diagonal
      }

      /**
       *  M      |  S
       *    A    |    A
       *      S  |      M
       */
      const southEast = grid[y + 1]?.[x + 1]
      const northWest = grid[y - 1]?.[x - 1]
      if (!((southEast === 'M' && northWest === 'S') || (southEast === 'S' && northWest === 'M'))) {
        return // invalid backward diagonal
      }
      count++ // got one!
    })
  })
  return count
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 18)
bench(logger, 'part 1 input', () => part1(INPUT), 2633)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 9)
bench(logger, 'part 2 input', () => part2(INPUT), 1936)
