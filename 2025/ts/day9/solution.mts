#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  product,
  combinations,
} from '../helpers/index.mjs'
import { Heap } from '../helpers/binary-heap.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string, maxConnections: number): string | number => {
  const nodes = inputHandler
    .toArray(path)
    .map(line => line.split(',').map(Number))
    .map(([x, y]) => ({ x, y }))

  const rectArea = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
    (1 + Math.abs(a.x - b.x)) * (1 + Math.abs(a.y - b.y))

  const rects = new Heap<{
    a: { x: number; y: number }
    b: { x: number; y: number }
    dist: number
  }>((a: { dist: number }, b: { dist: number }) => b.dist - a.dist)

  combinations(nodes).forEach(({ a, b }) => rects.push({ a, b, dist: rectArea(a, b) }))

  return rects.pop().dist
}

const part2 = (path: string): string | number => {
  interface Node {
    x: number
    y: number
  }
  const input = inputHandler.toArray(path)
  const corners: Node[] = input.map(line => line.split(',').map(Number)).map(([x, y]) => ({ x, y }))

  const validPointCache = new Map<number, Set<number>>()

  const verticalEdges: { x: number; startY: number; endY: number }[] = []
  const edges = corners.reduce((acc, corner, i, corners) => {
    const lastCorner = i === 0 ? corners[corners.length - 1] : corners[i - 1]
    if (corner.x === lastCorner.x) {
      const [startY, endY] =
        corner.y < lastCorner.y ? [corner.y, lastCorner.y] : [lastCorner.y, corner.y]
      verticalEdges.push({ x: corner.x, startY, endY })
      for (let y = startY + 1; y < endY; y++) {
        acc.add(`${corner.x},${y}`)
        validPointCache.has(corner.x) || validPointCache.set(corner.x, new Set<number>())
        validPointCache.get(corner.x)!.add(y)
      }
    } else if (corner.y === lastCorner.y) {
      const [startX, endX] =
        corner.x < lastCorner.x ? [corner.x, lastCorner.x] : [lastCorner.x, corner.x]
      for (let x = startX + 1; x < endX; x++) {
        acc.add(`${x},${corner.y}`)
        validPointCache.has(x) || validPointCache.set(x, new Set<number>())
        validPointCache.get(x)!.add(corner.y)
      }
    }
    return acc
  }, new Set<string>())

  verticalEdges.sort((a, b) => a.x - b.x)

  const candidateRectangles = combinations(corners)

  // const pointOnEdge = (point: Node): boolean => edges.has(`${point.x},${point.y}`)

  // const cornerSet = new Set<string>(corners.map(corner => `${corner.x},${corner.y}`))
  corners.forEach(corner => {
    validPointCache.has(corner.x) || validPointCache.set(corner.x, new Set<number>())
    validPointCache.get(corner.x)!.add(corner.y)
  })

  // const pointIsCorner = (point: Node): boolean => cornerSet.has(`${point.x},${point.y}`)

  const pointInPolygon = ({ x, y }: Node): boolean => {
    // because validPointCache is prepopulated with edge and corner points this check is now complete
    validPointCache.has(x) || validPointCache.set(x, new Set<number>())
    if (validPointCache.get(x)!.has(y)) {
      return true
    }

    const intersects = verticalEdges
      .filter(edge => edge.x <= x)
      .filter(({ startY, endY }) => y > startY && y <= endY).length

    if (intersects % 2 === 0) return false
    validPointCache.get(x)!.add(y)
    return true
  }

  const rectanglesHeap = new Heap<{
    a: { x: number; y: number; area: number }
    b: { x: number; y: number; area: number }
    area: number
  }>((a: { area: number }, b: { area: number }) => b.area - a.area)

  const rectArea = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
    (1 + Math.abs(a.x - b.x)) * (1 + Math.abs(a.y - b.y))

  candidateRectangles.forEach(({ a, b }) => rectanglesHeap.push({ a, b, area: rectArea(a, b) }))

  const pointIsValid = (point: Node): boolean => pointInPolygon(point)

  const rectangleIsValid = ({ a, b }: { a: Node; b: Node }): boolean => {
    // check opposite corners first
    const cornerPoints = [
      { x: a.x, y: b.y },
      { x: b.x, y: a.y },
    ]
    if (!cornerPoints.every(pointIsValid)) {
      return false
    }

    const perimeterPoints: Node[] = []
    const [minX, maxX] = [a.x, b.x].sort((a, b) => a - b)
    const [minY, maxY] = [a.y, b.y].sort((a, b) => a - b)
    for (let x = minX + 1; x < maxX; x++) {
      perimeterPoints.push({ x, y: minY })
      perimeterPoints.push({ x, y: maxY })
    }
    for (let y = minY + 1; y < maxY; y++) {
      perimeterPoints.push({ x: minX, y })
      perimeterPoints.push({ x: maxX, y })
    }
    if (!perimeterPoints.every(pointIsValid)) {
      return false
    }

    return true
  }

  while (true) {
    const candidate = rectanglesHeap.pop()
    if (!candidate) break
    if (rectangleIsValid(candidate)) {
      return candidate.area
    }
  }
  return 0
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 10), 50)
bench(logger, 'part 1 input', () => part1(INPUT, 1000), 4748826374)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 24)
bench(logger, 'part 2 input', () => part2(INPUT), 1554370486)
