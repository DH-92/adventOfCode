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

const logger = new Logger()

const getPairs = <T extends any>(arr: T[]): [T, T][] =>
  arr.flatMap((v1): [T, T][] => arr.map((v2): [T, T] => [v1, v2]))

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const height = lines.length
  const width = lines[0].length
  const towers = lines
    .map(line => line.split(''))
    .flatMap((line, y) => line.map((char, x) => ({ x, y, z: char.charCodeAt(0) })))
    .filter(({ z }) => z !== 46) // '.`.charCodeAt(0) === 46

  return Object.values(Object.groupBy(towers, tower => tower.z))
    .filter(x => !!x)
    .flatMap(towers => getPairs(towers).filter(([tower1, tower2]) => tower1 !== tower2))
    .map(function towerPairsToAntiNodes([tower1, tower2]) {
      const dx = tower2.x - tower1.x
      const dy = tower2.y - tower1.y
      const x = tower1.x - dx
      const y = tower1.y - dy
      return { x, y }
    })
    .filter(({ x, y }) => y >= 0 && y < height && x >= 0 && x < width)
    .map(x => JSON.stringify(x))
    .reduce((set, x) => set.add(x), new Set()).size
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const height = lines.length
  const width = lines[0].length
  const inGrid = ({ x, y }: { x: number; y: number }) => x >= 0 && x < height && y >= 0 && y < width
  const vectorMove = (
    { x, y }: { x: number; y: number },
    { dx, dy }: { dx: number; dy: number },
  ) => ({ x: x + dx, y: y + dy })
  const towersByFrequency = lines
    .map(line => line.split(''))
    .reduce(
      (towersByFrequency, line, y) => {
        line.forEach((char, x) => {
          if (char === '.') return
          const tower = { x, y }
          const frequency = char.charCodeAt(0)
          towersByFrequency[frequency] ??= []
          towersByFrequency[frequency].push(tower)
        })
        return towersByFrequency
      },
      [] as { x: number; y: number }[][],
    )

  return towersByFrequency
    .flatMap(towers => getPairs(towers).filter(([tower1, tower2]) => tower1 !== tower2))
    .flatMap(([tower1, tower2]) => {
      const antiNodes: { x: number; y: number }[] = []
      const delta = { dx: tower2.x - tower1.x, dy: tower2.y - tower1.y }
      let node = { ...tower1 }
      while (inGrid(node)) {
        antiNodes.push(node)
        node = vectorMove(node, delta)
      }
      return antiNodes
    })
    .map(x => JSON.stringify(x))
    .reduce((set, x) => set.add(x), new Set()).size
}

console.clear()
// bench(logger, 'part 1 example 2', () => part1('example2.txt'), 2)
bench(logger, 'part 1 example', () => part1(EXAMPLE), 14)
bench(logger, 'part 1 input', () => part1(INPUT), 308)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 34)
bench(logger, 'part 2 input', () => part2(INPUT), 1147)
