#!/usr/bin/env zx
import "zx/globals"
import { fileToArr,sum, numSort } from "../helpers/index.mjs"
const day = "day7";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const TargetDirSize = 100000;
const diskSize = 70000000;
const requiredFree = 30000000;

const parseInput = (path) => {
    const dirs = [];
    class Dir {
        children = {};
        size = 0;
        constructor(name, parent) {
            this.name = name;
            this.parent = parent;
        }
        du = () => {
            Object.values(this.children).forEach(child => this.size += child.du())
            dirs.push(this.size);
            return this.size;
        }

    }

    const root = new Dir("/", null);
    let pwd = root;

    fileToArr(path).forEach(line => {
        const args = line.split(' ');
        switch(args[0]) {
            case "$":
                switch (args[1]) {
                    case "cd":
                        const target = args[2];
                        pwd = (target === "/")
                            ? root
                            : (target === "..")
                                ? pwd.parent
                                : pwd.children[args[2]];
                        break;
                    case "ls":
                    case "default":
                }
                break;
            case "dir":
                pwd.children[args[1]] = new Dir(args[0], pwd);
                break;
            default: //it's a folder
                pwd.size += +args[0];
        }
    })
    
    const sizeToFree = requiredFree - (diskSize - root.du(root));
    const smallestDeletable = dirs.filter(size => size >= sizeToFree).sort(numSort)[0];
    const dirsUnderLimit = dirs.filter(size => size <= TargetDirSize).reduce(sum);
    return [dirsUnderLimit, smallestDeletable];
}

echo(`part1 -- example: ${parseInput(example)[0]}`)
echo(`part1 -- input: ${parseInput(input)[0]}`)

echo(`part2 -- example: ${parseInput(example)[1]}`)
echo(`part2 -- input: ${parseInput(input)[1]}`)
