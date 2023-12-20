#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  PARAGRAPH,
  LINE,
  sum,
  lcmA,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()

class Node {
  type: number
  key: string
  vals: string[]
  state: boolean | Record<string, boolean>
  outputs: Node[]
  inputs: Node[]
  constructor(type: number, key: string, vals: string[]) {
    this.type = type
    this.key = key
    this.vals = vals
    this.outputs = []
    this.inputs = []
    if (this.type === 2) {
      this.state = {}
    } else {
      this.state = false
    }
  }
  toString() {
    return `Node: ${this.key}`
  }
}

interface Pulse {
  val: boolean | Record<string, boolean>
  node: Node
  from?: string
}

const part1 = (path: string): string | number => {
  const nodes: Record<string, Node> = inputHandler
    .toArray(path)
    .map(p => p.split(/ -> /))
    .reduce((nodes, [key, right]) => {
      const vals = [...right.matchAll(/\w+/g)].map(x => x[0])
      if (key === 'broadcaster') {
        nodes[key] = new Node(3, 'broadcaster', vals)
        return nodes
      }
      const type = parseInt([...key.replaceAll(/\w+/g)][0][0].replace('%', '1').replace('&', '2'))
      const node = new Node(type, key.slice(1), vals)
      nodes[key.slice(1)] = node
      return nodes
    }, {})

  Object.values(nodes).forEach(node =>
    node.vals.forEach(outKey => {
      node.outputs.push((nodes[outKey] ??= new Node(5, outKey, [])))
      nodes[outKey].inputs.push(node)
      if (nodes[outKey].type === 2) nodes[outKey].state[node.key] = false
    })
  )
  let lo = 0
  let hi = 0

  for (let i = 0; i < 1000; i++) {
    const pulses: Pulse[] = [{ val: false, node: nodes['broadcaster'] }]
    let pulse: Pulse | undefined
    while ((pulse = pulses.shift())) {
      if (pulse.val) {
        hi++
      } else lo++
      const { val, from, node } = pulse
      const { state, type, key, outputs } = node
      if (type === 3) {
        outputs.forEach(out => pulses.push({ val, node: out, from: key }))
        continue
      }
      if (type === 1) {
        if (val) continue
        node.state = !state
        outputs.forEach(out => pulses.push({ val: node.state, node: out, from: key }))
        continue
      }
      if (type === 2) {
        state[from!] = val
        const allHi = Object.values(state).every(x => x)
        outputs.forEach(out => pulses.push({ val: !allHi, node: out, from: key }))
      }
    }
  }
  return lo * hi
}

const part2 = (path: string): string | number => {
  const nodes: Record<string, Node> = inputHandler
    .toArray(path)
    .map(p => p.split(/ -> /))
    .reduce((nodes, [key, right]) => {
      const vals = [...right.matchAll(/\w+/g)].map(x => x[0])
      if (key === 'broadcaster') {
        nodes[key] = new Node(3, 'broadcaster', vals)
        return nodes
      }
      const type = parseInt([...key.replaceAll(/\w+/g)][0][0].replace('%', '1').replace('&', '2'))
      const node = new Node(type, key.slice(1), vals)
      nodes[key.slice(1)] = node
      return nodes
    }, {})

  Object.values(nodes).forEach(node =>
    node.vals.forEach(outKey => {
      node.outputs.push((nodes[outKey] ??= new Node(0, outKey, [])))
      nodes[outKey].inputs.push(node)
      if (nodes[outKey].type === 2) nodes[outKey].state[node.key] = false
    })
  )
  let going = true
  let i = 0
  let lcmKeys = {}
  while (going) {
    i++
    const pulses: Pulse[] = [{ node: nodes['broadcaster'] }]
    let pulse: Pulse | undefined
    while ((pulse = pulses.shift())) {
      const { val, from, node } = pulse
      const { state, type, key, outputs } = node
      switch (type) {
        case 1:
          if (val) continue
          node.state = !state
          outputs.forEach(out => pulses.push({ val: node.state, node: out, from: key }))
          continue
        case 2:
          state[from!] = val
          const allHi = Object.values(state).every(x => x)
          if (outputs[0].key !== 'rx') {
            outputs.forEach(out => pulses.push({ val: !allHi, node: out, from: key }))
            continue
          }
          Object.entries(state)
            .filter(([_, v]) => v)
            .forEach(([k, _]) => (lcmKeys[k] = i))
          if (Object.values(lcmKeys).length === Object.values(state).length) {
            return lcmA(Object.values(lcmKeys))
          }
        case 3:
          outputs.forEach(out => pulses.push({ val, node: out, from: key }))
      }
    }
  }
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 32000000)
  bench(logger, 'part 1 example', () => part1('example2.txt'), 11687500)
  bench(logger, 'part 1 input', () => part1(INPUT), 680278040)
  bench(logger, 'part 2 input', () => part2(INPUT), 243548140870057)
} catch (e) {
  console.error(e)
}
