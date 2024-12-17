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

type State = {
  registers: bigint[]
  output: number[]
}

const part1 = (path: string): string | number => {
  const [para1, para2] = inputHandler.toArray(path, PARAGRAPH)
  const registers = para1.split(LINE).flatMap(line => line.match(/(\d+)/g).map(Number))
  const commands = para2.split(LINE).flatMap(line => line.match(/(\d+)/g).map(Number))
  let instructionPointer = 0
  console.log(registers)
  console.log(commands)
  const combo = (operand: Number) => {
    switch (operand) {
      case 0:
        return 0
      case 1:
        return 1
      case 2:
        return 2
      case 3:
        return 3
      case 4:
        return registers[0]
      case 5:
        return registers[1]
      case 6:
        return registers[2]
      default:
        throw new Error(`Invalid combo operand: ${operand}`)
    }
  }
  let output = ''
  const ops = [
    // adv
    (operand: number): void => {
      const numerator = registers[0]
      const denominator = 2 ** combo(operand)
      registers[0] = Math.floor(numerator / denominator)
    },
    // bxl
    (operand: number): void => {
      const a = registers[1]
      const b = operand
      registers[1] = a ^ b
    },
    // bst
    (operand: number): void => {
      const a: number = combo(operand)
      registers[1] = a % 8
    },
    // jnz
    (operand: number): void => {
      if (registers[0] !== 0) {
        instructionPointer = operand - 2
      }
    },
    // bxc
    (operand: number): void => {
      registers[1] = registers[1] ^ registers[2]
    },
    // out
    (operand: number): void => {
      const c = combo(operand)
      const a = c % 8
      output += `${a},`
    },
    // bdv
    (operand: number): void => {
      const numerator = registers[0]
      const denominator = 2 ** combo(operand)
      registers[1] = Math.floor(numerator / denominator)
    },
    // cdv
    (operand: number): void => {
      const numerator = registers[0]
      const denominator = 2 ** combo(operand)
      registers[2] = Math.floor(numerator / denominator)
    },
  ]
  while (true) {
    console.log(instructionPointer, commands.length)
    if (instructionPointer >= commands.length - 1) {
      console.log('break')
      break
    }
    const a = commands[instructionPointer]
    const b = commands[instructionPointer + 1]
    console.log({ a, b })
    ops[a](b)
    instructionPointer += 2
  }
  return output.slice(0, -1)
}

const part2 = (path: string): number => {
  const [para1, para2] = inputHandler.toArray(path, PARAGRAPH)
  // const regs = para1.split(LINE).flatMap(line => line.match(/(\d+)/g).map(Number))
  const commands = para2.split(LINE).flatMap(line => line.match(/(\d+)/g)!.map(Number))
  const ops = [
    // adv
    (operand: bigint, state: State): void => {
      state.registers[0] =
        state.registers[0] >> (operand < 4n ? operand : state.registers[Number(operand - 4n)])
    },
    // bxl
    (operand: bigint, state: State): void => {
      state.registers[1] ^= operand
    },
    // bst
    (operand: bigint, state: State): void => {
      state.registers[1] = operand < 4 ? operand : state.registers[Number(operand - 4n)] & 7n
    },
    // jnz
    (operand: bigint, state: State): void => {
      if (state.registers[0] !== 0n) state.registers[3] = operand - 2n
    },
    // bxc
    (operand: bigint, state: State): void => {
      state.registers[1] ^= state.registers[2]
    },
    // out
    (operand: bigint, state: State): void => {
      state.output.push(Number(operand < 4n ? operand : state.registers[Number(operand - 4n)] & 7n))
    },
    // bdv
    (operand: bigint, state: State): void => {
      state.registers[1] =
        state.registers[0] >> (operand < 4 ? operand : state.registers[operand - 4])
    },
    // cdv
    (operand: bigint, state: State): void => {
      state.registers[2] =
        state.registers[0] >> (operand < 4 ? operand : state.registers[Number(operand - 4n)])
    },
  ]
  for (let i = 105734774294938n; i <= 105734774294938n; i++) {
    const state = {
      registers: [i, 0n, 0n, 0n],
      output: Array<number>(),
    }
    while (true) {
      if (state.registers[3] >= commands.length - 1) break
      const a = commands[Number(state.registers[3])]
      const b = BigInt(commands[Number(state.registers[3] + 1n)])
      ops[a](b, state)
      if (a === 5) {
        const l = state.output.length - 1
        if (state.output[l] !== commands[l]) break
      }
      state.registers[3] += 2n
    }
    console.log({ state })
    console.log({ out: state.output })
    console.log({ commands })
    if (state.output.toString() === commands.toString()) {
      return i
    }
    if (i % 1_000_000n === 0n) console.log(i)
  }
  throw new Error('No solution found')
}


const logger = new Logger()

// bench(logger, 'part 1 example', () => part1(EXAMPLE), '4,6,3,5,6,3,5,2,1,0')
// bench(logger, 'part 1 input', () => part1(INPUT), '7,3,5,7,5,7,4,3,0')
// bench(logger, 'part 2 example', () => part2('example2.txt'), 117440)
bench(logger, 'part 2 input', () => part2(INPUT), 105734774294938n)
