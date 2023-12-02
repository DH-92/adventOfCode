export const EXAMPLE = 'example.txt'
export const INPUT = 'input.txt'

export const WORD = /\s/g
export const LINE = '\n'
export const PARAGRAPH = '\n\n'

export class InputHandler {
  private puzzleDay: string
  private inputDir: string
  constructor(cwd: string) {
    this.puzzleDay = path.basename(cwd)
    this.inputDir = path.join(cwd, `../../input/${this.puzzleDay}`)
  }
  toString = (file: string): string => fs.readFileSync(`${this.inputDir}/${file}`).toString()
  toArray = (file: string, delim: string | RegExp = LINE): string[] =>
    this.toString(file).split(delim)
}

export const sum = (acc: number, cal: number): number => acc + cal
export const product = (acc: number, cal: number): number => acc * cal
export const numSort = (a: number, b: number): number => a - b
export const numSortR = (a: number, b: number): number => b - a

export const stringBisect = (str: string): [string, string] => [
  str.slice(0, str.length / 2),
  str.slice(str.length / 2),
]
export const stringFindCommon = (a: string, b: string): string[] =>
  [...a].filter(a => b.includes(a))

export const intDiv = (numerator: number, divisor: number): [number, number] => [
  Math.floor(numerator / divisor),
  numerator % divisor,
]
export const reshape = <T,>(flat: T[], width: number): T[][] =>
  flat.reduce(
    (rect, cell, index) => {
      const col = Math.floor(index / width)
      const row = index % width
      rect[col] ??= []
      rect[col][row] = cell
      return rect
    },
    [[]] as T[][]
  )

export const transpose = <T,>(matrix: T[][]): T[][] =>
  matrix.reduce((prev, next) => next.map((_, i) => (prev[i] ?? []).concat(next[i])), [[]] as T[][])

export function bench<T>(name: string, func: () => T, expected?: T) {
  const start = performance.now()
  const result = func()
  const end = performance.now()

  let duration = end - start

  const assert =
    typeof expected !== 'undefined' && result !== expected ? ` !!! EXPECTED ${expected} !!!` : ''

  if (typeof result === 'string' && /\n/.test(result)) {
    console.log('%s: [%s]%c%s', name, duration.toFixed(2) + 'ms', 'color: red', assert)
    console.log(result)
    return
  }

  console.log('%s: %o [%s]%c%s', name, result, duration.toFixed(2) + 'ms', 'color: red', assert)
  if (assert !== '') {
    throw `${name}: ${result} [${duration.toFixed(2)}ms] ${assert}`
  }
}
