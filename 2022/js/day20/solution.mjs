#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day20";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)


const calc = (path,key,loops) => {
    const input = fileToArr(path).map(Number);
    const ll = [];
    let zero;
    let prev;
    const l = input.length;

    class Node {
        forward = () => {
            const b1 = this.prev;
            const f1 = this.next;
            const f2 = f1.next;
            b1.next = f1;
            f1.prev = b1;
            f1.next = this;
            this.prev = f1;
            this.next = f2;
            f2.prev = this;
        }
        backward = () => {
            const f1 = this.next;
            const b1 = this.prev;
            const b2 = b1.prev;
            b1.next = f1;
            f1.prev = b1;
            b1.prev = this;
            this.next = b1;
            this.prev = b2;
            b2.next = this;
        }
        move = () => {
            const dir = this.val > 0 ? this.forward : this.backward
            for (let i = 0; i < (Math.abs(this.val)%(l-1)); i++) {
                dir()
            }
        }
        constructor(val, prev, next) {
            this.val = val;
            this.prev = prev;
            this.next = next;
        }
    }

    const printList = () => {
        let val = true
        let cur = zero;
        let list = []
        while (val) {
            list.push(cur.val)
            cur = cur.next
            val = cur.val;
        }
        console.log(list.join(', '))
    }

    const ans = () => {
        let k1;
        let k2;
        let k3;
        let pos = 0;
        let cur = zero;
        while (true) {
            if (pos === 1000) k1 = cur.val
            if (pos === 2000) k2 = cur.val
            if (pos === 3000) {
                k3 = cur.val
                break;
            }
            cur = cur.next
            pos++;
        }
        return(k1+k2+k3)
    }

    for (let i = 0; i < input.length; i++) {
        ll[i] = new Node(input[i]*key, prev);
        if (input[i] === 0) zero = ll[i];
    }
    for (let i = 0; i < input.length; i++) {
        const next = i !== ll.length - 1 ? ll[i + 1] : ll[0];
        const prev = i !== 0 ? ll[i - 1] : ll[input.length - 1];
        ll[i].next = next
        ll[i].prev = prev
    }

    for (let i = 0; i < loops; i++) {
        ll.forEach(n => n.move())
    }
    return ans();
}

console.time()
console.log(`part1 -- example: ${calc(example, 1,1)}`)
console.log(`part1 -- input: ${calc(input, 1,1)}`)
console.log(`part1 -- example: ${calc(example, 811589153, 10)}`)
console.log(`part1 -- input: ${calc(input,811589153, 10)}`)
console.timeLog()