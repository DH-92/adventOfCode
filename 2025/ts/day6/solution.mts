#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  WORD,
  bench,
  Logger,
  sum,
  getPrimes,
  PARAGRAPH,
  LINE,
  transpose,
  product,
  reshape,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  const problems = transpose(
    inputHandler.toGrid(path, LINE, / +/).map(row => row.filter(s => s.length > 0)),
  )

  const ans = problems.map(problem => {
    const operator = problem.pop()
    switch (operator) {
      case '*':
        return problem.map(Number).reduce(product)
      case '+':
        return problem.map(Number).reduce(sum)
      default:
        throw new Error(`Unknown operator ${operator}`)
    }
  })

  return ans.reduce(sum)
}

const part2 = (path: string): string | number => {
  let inputCount = 0
  const transposedInput: string[][][] = []

  const input = transpose(inputHandler.toGrid(path))
  while (input.length) {
    const row = input.pop()!
    const emptyRow = row.every(cell => cell.trim() === '')
    if (emptyRow) {
      inputCount++
      continue
    }
    transposedInput[inputCount] ??= []
    transposedInput[inputCount].push(row)
  }

  const problems = transposedInput.map(problem => {
    const operator = problem
      .map(v => v.pop())
      .join('')
      .trim()
    const values = problem.map(row => Number(row.join('').trim()))
    return { values, operator }
  })

  const ans = problems.map(({ operator, values }) => {
    let x
    switch (operator) {
      case '*':
        x = values.reduce(product)
        break
      case '+':
        x = values.reduce(sum)
        break
      default:
        throw new Error(`Unknown operator ${operator}`)
    }
    return x
  })

  return ans.reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 4277556)
bench(logger, 'part 1 input', () => part1(INPUT), 6171290547579)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 3263827)
bench(logger, 'part 2 input', () => part2(INPUT), 8811937976367)
