#!/usr/bin/env zx
import "zx/globals"
import { fileToArr, sum, numSort } from "../helpers/index.mjs"
const day = "day7";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const TargetDirSize = 100000;
const diskSize = 70000000;
const requiredFree = 30000000;

class Dir {
    children = {};
    size = 0;
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
        this.dirs = parent ? parent.dirs : [];
        this.root = parent ? parent.root : this;
    }
    du = () => {
        Object.values(this.children).forEach(child => this.size += child.du())
        this.dirs.push(this.size);
        return this.size;
    }
}

const parseInput = (path) => {
    const root = new Dir("/", null);
    let cwd = root;

    fileToArr(path).forEach(line => {
        const args = line.split(' ');
        switch (args[0]) {
            case "$":
                // commands[args[1]](cwd,args[2]); break
                switch (args[1]) {
                    case "cd":
                        const target = args[2];
                        cwd = (target === "/")
                            ? cwd.root
                            : (target === "..")
                                ? cwd.parent
                                : cwd.children[target];
                        break;
                    case "ls":
                    case "default":
                }
                break;
            //as ls is the only command with output assume we're in ls's output
            case "dir":
                cwd.children[args[1]] = new Dir(args[0], cwd); break;
            default: //it's a folder
                cwd.size += +args[0];
        }
    })
    root.du();
    return root;
}
const part1 = (path) => {
    return parseInput(path).dirs
        .filter(size => size <= TargetDirSize)
        .reduce(sum);
}

const part2 = (path) => {
    const root = parseInput(path);
    const sizeToFree = requiredFree - (diskSize - root.size);
    return root.dirs
        .filter(size => size >= sizeToFree)
        .sort(numSort)[0];
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
