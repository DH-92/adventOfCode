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
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  const paragraphs = inputHandler.toArray(path, PARAGRAPH).map(l => l.split('\n'))
  const rules = paragraphs[0].map(l => l.split('|').map(Number))
  const updates = paragraphs[1].map(l => l.split(',').map(Number))

  return updates
    .map(pages => {
      const activeRules = rules.filter((rule) => rule.every(val => pages.includes(val)))
      const activeDependencies = activeRules.reduce(
        (acc, [after, before]) => {
          acc[before] ??= new Set()
          acc[before].add(after)
          return acc
        },
        {} as Record<number, Set<number>>,
      )

      const isFaulty = pages.some(page => {
        const pageHasActiveDependency = activeDependencies[page]?.size
        if (pageHasActiveDependency) {
          return true // The page depends on another page that is after it
        }
        // Remove the page from all other dependencies
        Object.values(activeDependencies).forEach(set => set.delete(page))
        return false
      })
      return isFaulty ? 0 : pages[Math.floor(pages.length / 2)]
    })
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const paragraphs = inputHandler.toArray(path, PARAGRAPH).map(l => l.split('\n'))
  const rules = paragraphs[0].map(l => l.split('|').map(Number))
  const updates = paragraphs[1].map(l => l.split(',').map(Number))

  return updates
    .map(pages => {
      const updating = new Set(pages)

      const activeRules = rules.filter((rule) => rule.every(val => updating.has(val)))

      const activeDependencies = activeRules.reduce(
        (acc, [after, before]) => {
          acc[before] ??= new Set()
          acc[before].add(after)
          return acc
        },
        {} as Record<number, Set<number>>,
      )
      const orderedPages: number[] = []
      while (updating.size) {
        const nextPage = [...updating].find(page => !activeDependencies[page]?.size)!
        orderedPages.push(nextPage)
        updating.delete(nextPage)
        Object.values(activeDependencies).forEach(set => set.delete(nextPage))
      }
      const isValid = `${orderedPages}` === `${pages}`
      return isValid ? 0 : orderedPages[Math.floor(orderedPages.length / 2)]
    })
    .reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 143)
bench(logger, 'part 1 input', () => part1(INPUT), 5275)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 123)
bench(logger, 'part 2 input', () => part2(INPUT), 6191)
