#!/bin/bash
year=2022;

#init input folder structure
for d in {1..25}; do
  mkdir -p "${year}/input/day${d}"
  touch "${year}/input/day${d}/input.txt"
  touch "${year}/input/day${d}/example.txt"
done

#init JS folder structure
for d in {1..25}; do
  mkdir -p "${year}/js/day${d}"
  echo '#!/usr/bin/env zx
const input="../../input/day'${d}'/input.txt"
const example="../../input/day'${d}'/example.txt"
' > "${year}/js/day${d}/solution.mjs"
done