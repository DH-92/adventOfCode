#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day16";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

class Node {
    adj = {};
    constructor(id, name, v, neighbours) {
        this.id = id;
        this.name = name;
        this.v = v;
        this.neighbours = neighbours;
    }
}

const calc = (path,players,rounds) => {
    const rooms = [];
    const input = fileToArr(path)
    const nameToId = {}
    const valves = [0]
    let curr;
    input.forEach((l,i) => {
        const [, name, , , rate, , , , , ...n] = l.split(' ')
        const nn = n.map(n => n.replace(/[^a-z0-9]/gi, ''))
        nameToId[name] = i;
        const fr = Number(rate.split('=')[1].split(';')[0])
        let v;
        if (fr !== 0) {
            v = valves.length;
            valves.push(fr)
        }
        const node = new Node(i, name, v, nn);
        rooms[i] = node;
        if (name === "AA") curr = node;
    })
    rooms.forEach(node => {
        node.neighbours.forEach(n => {
            const nieghbourId = nameToId[n];
            node.adj[nieghbourId] = rooms[nieghbourId];
        })
        delete node.name
        delete node.neighbours
    })

    const cache = new Array(players + 1).fill(null).map(x =>
        new Array(rooms.length+1).fill(null).map(y =>
            new Array(rounds + 1).fill(null).map(z => [])
        )
    )
    const assess = (remainingPlayers, room, valveState, time) => {
        const key = cache[remainingPlayers][room.id][time];
        if (key[valveState] !== undefined) return key[valveState];
        if (!time) {
            if (!remainingPlayers) return 0;
            return assess(0, curr, valveState, rounds)
        };
        const turnValve = (room.v && !((1 << room.v) & valveState))
            ? (valves[room.v] * (time - 1)) + assess(remainingPlayers, room, (1 << room.v) | valveState, time - 1)
            : 0
        return key[valveState] = Math.max(
            turnValve,
            ...Object.values(room.adj).map((n) => assess(remainingPlayers, n, valveState, time - 1))
        )
    }
    return assess(players,curr, 0, rounds);
}

console.time()
console.log(`part1 -- example: ${calc(example,0,30)}`)
console.log(`part1 -- input: ${calc(input,0,30)}`)
console.log(`part2 -- example: ${calc(example,1,26)}`)
console.log(`part2 -- input: ${calc(input,1,26)}`)
console.timeLog()