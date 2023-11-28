#!/usr/bin/env zx

class Marble {
  constructor(value = 0, prev = this, next = this) {
    this.value = value;
    this.prev = prev;
    this.next = next;
    prev.next = this;
    next.prev = this;
  }
}

const solve = (playerCount = 9, turns = 25) => {
  const players = new Array(playerCount + 1).fill(0);
  let current = new Marble();
  for (let turn = 1; turn <= turns; turn++) {
    if (turn % 23) {
      current = new Marble(turn, current.next, current.next.next);
      continue;
    }
    for (let i = 0; i < 7; i++) current = current.prev;
    players[1 + ((turn - 1) % playerCount)] += current.value + turn;
    current.prev.next = current.next;
    current.next.prev = current.prev;
    current = current.next;
  }
  return players.sort().reverse()[0];
};

console.time('p1e');
console.log(`part1 -- example: ${solve()}`);
console.timeEnd('p1e');
console.time('p1');
console.log(`part1 -- part 1: ${solve(493, 71863)}`);
console.timeEnd('p1');
console.time('p2');
console.log(`part2 -- part 2: ${solve(493, 7186300)}`);
console.timeEnd('p2');
